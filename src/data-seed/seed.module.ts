import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { SymptomVN, SymptomVNSchema } from '../symptom/symptom-vn.schema';
import { SymptomEN, SymptomENSchema } from '../symptom/symptom-en.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SymptomVN.name, schema: SymptomVNSchema },
      { name: SymptomEN.name, schema: SymptomENSchema }
    ])
  ],
  providers: [SeedService, SeedResolver],
})
export class SeedModule {}