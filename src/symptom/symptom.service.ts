import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Symptom, SymptomDocument } from './symptom.schema';
import { SymptomVN, SymptomVNDocument } from './symptom-vn.schema';
import { SymptomEN, SymptomENDocument } from './symptom-en.schema';
import { Model } from 'mongoose';
import { SymptomInput, SymptomResult } from './symptom.type';
import { AIService } from 'src/ai/ai.service';

@Injectable()
export class SymptomService {
  constructor(
    @InjectModel(Symptom.name)
    private model: Model<SymptomDocument>,
    @InjectModel(SymptomVN.name)
    private symptomVNModel: Model<SymptomVNDocument>,
    @InjectModel(SymptomEN.name)
    private symptomENModel: Model<SymptomENDocument>,
    private readonly aiService: AIService
  ) {}

  private normalizeText(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  private getWordSet(text: string): Set<string> {
    return new Set(this.normalizeText(text).split(' ').filter(word => word.length > 0));
  }



  async create(input: SymptomInput): Promise<Symptom> {
    return this.model.create(input);
  }

  async findAll(): Promise<Symptom[]> {
    let data: Symptom[] = [];
    
    try{
      data = await this.model.find().exec();
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }

    return data;
  }

  async findBySeverity(severity: number): Promise<Symptom[]> {
    return this.model.find({ severity }).exec();
  }

  async consultant(input: string): Promise<String> {
    const result = await this.aiService.analyzeSymptoms(input);
    return  result;//symptom.save();
  }

  async findBySymptom(symptom: string, language: string): Promise<SymptomVN | SymptomEN | null> {
    if (language.toLowerCase() === 'vn') {
      return this.symptomVNModel.findOne({ symptom }).exec();
    } else if (language.toLowerCase() === 'en') {
      return this.symptomENModel.findOne({ symptom }).exec();
    }
    return null;
  }

  async searchSymptoms(query: string, language: string): Promise<SymptomResult | null> {
    const queryWords = this.getWordSet(query);
    let allSymptoms: (SymptomVN | SymptomEN)[] = [];
    
    if (language.toLowerCase() === 'vn') {
      allSymptoms = await this.symptomVNModel.find().exec();
    } else if (language.toLowerCase() === 'en') {
      allSymptoms = await this.symptomENModel.find().exec();
    }
    
    // Find symptom where all query words match (order doesn't matter)
    const result = allSymptoms.find(symptom => {
      const symptomWords = this.getWordSet(symptom.symptom);
      
      // Check if all query words exist in symptom words
      for (const queryWord of queryWords) {
        if (!symptomWords.has(queryWord)) {
          return false;
        }
      }
      
      // Check if symptom has same number of words (exact match)
      return queryWords.size === symptomWords.size;
    });
    
    if (!result) return null;
    
    // Transform to required format
    return {
      Symptom: result.symptom,
      Description: result.description,
      PossibleConditions: result.possibleConditions,
      Source: result.source,
      SourceLink: result.sourceLink,
      SeverityLevel: result.severityLevel,
      RecommendedAction: result.recommendedAction
    };
  }
}