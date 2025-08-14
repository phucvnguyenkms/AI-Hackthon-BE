import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SymptomVN, SymptomVNDocument } from '../symptom/symptom-vn.schema';
import { SymptomEN, SymptomENDocument } from '../symptom/symptom-en.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(SymptomVN.name)
    private symptomVNModel: Model<SymptomVNDocument>,
    @InjectModel(SymptomEN.name)
    private symptomENModel: Model<SymptomENDocument>
  ) {}

  async seedSymptomsFromVN(): Promise<string> {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data-seed', 'vn', 'symptoms.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const rawData = JSON.parse(fileContent);
      
      const symptoms = rawData.map((item: any) => ({
        symptom: item.Symptom || 'Unknown',
        description: item.Description || '',
        possibleConditions: item['Possible Conditions'] || '',
        source: item.Source || '',
        sourceLink: item['Source Link'] || '',
        severityLevel: item['Severity Level'] || 'Nhẹ',
        recommendedAction: item['Recommended Action'] || ''
      }));
      
      for (const symptom of symptoms) {
        try {
          await this.symptomVNModel.create(symptom);
        } catch (err) {
          console.log(`Skipped duplicate: ${symptom.symptom}`);
        }
      }
      
      return `Successfully seeded ${symptoms.length} VN symptoms`;
    } catch (error) {
      return `Error seeding VN symptoms: ${error.message}`;
    }
  }

  async seedSymptomsFromEN(): Promise<string> {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data-seed', 'en', 'symptoms.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const rawData = JSON.parse(fileContent);
      
      const symptoms = rawData.map((item: any) => ({
        symptom: item.Symptom || 'Unknown',
        description: item.Description || '',
        possibleConditions: item['Possible Conditions'] || '',
        source: item.Source || '',
        sourceLink: item['Source Link'] || '',
        severityLevel: item['Severity Level'] || 'Mild',
        recommendedAction: item['Recommended Action'] || ''
      }));
      
      for (const symptom of symptoms) {
        try {
          await this.symptomENModel.create(symptom);
        } catch (err) {
          console.log(`Skipped duplicate: ${symptom.symptom}`);
        }
      }
      
      return `Successfully seeded ${symptoms.length} EN symptoms`;
    } catch (error) {
      return `Error seeding EN symptoms: ${error.message}`;
    }
  }
}