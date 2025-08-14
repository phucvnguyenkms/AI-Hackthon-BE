import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Symptom, SymptomSchema } from './symptom.schema';
import { SymptomVN, SymptomVNSchema } from './symptom-vn.schema';
import { SymptomEN, SymptomENSchema } from './symptom-en.schema';
import { AIService } from '../ai/ai.service';
import { SymptomService } from './symptom.service';
import { SymptomResolver } from './symptom.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Symptom.name, schema: SymptomSchema },
      { name: SymptomVN.name, schema: SymptomVNSchema },
      { name: SymptomEN.name, schema: SymptomENSchema }
    ])
  ],
  providers: [AIService, SymptomService, SymptomResolver],
  exports: [SymptomService],
})
export class SymptomModule {}