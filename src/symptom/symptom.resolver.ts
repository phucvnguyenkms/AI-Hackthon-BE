import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SymptomService } from './symptom.service';
import { Symptom } from './symptom.schema';
import { SymptomVN } from './symptom-vn.schema';
import { SymptomEN } from './symptom-en.schema';
import { SymptomInput, SymptomResult } from './symptom.type';
import { createUnionType } from '@nestjs/graphql';

const SymptomUnion = createUnionType({
  name: 'SymptomUnion',
  types: () => [SymptomVN, SymptomEN],
  resolveType(value) {
    return value.constructor.name === 'SymptomVN' ? SymptomVN : SymptomEN;
  },
});

@Resolver(() => Symptom)
export class SymptomResolver {
  constructor(private readonly service: SymptomService) {}

  @Mutation(() => Symptom)
  createSymptom(@Args('input') input: SymptomInput) {
    return this.service.create(input);
  }

  @Mutation(() => String)
  async consultant(@Args('input') input: string) {
    console.log('Received input:', input);
    return this.service.consultant(input);
  }

  @Query(() => [Symptom])
  symptoms() {
    return this.service.findAll();
  }

  @Query(() => [Symptom])
  symptomByLevel(@Args('severity', { type: () => Int }) severity: number) {
    return this.service.findBySeverity(severity);
  }

  @Query(() => SymptomUnion, { nullable: true })
  async findSymptom(
    @Args('symptom') symptom: string,
    @Args('language') language: string
  ): Promise<typeof SymptomUnion | null> {
    return this.service.findBySymptom(symptom, language);
  }

  @Query(() => SymptomResult, { nullable: true })
  async searchSymptoms(
    @Args('query') query: string,
    @Args('language') language: string
  ): Promise<SymptomResult | null> {
    return this.service.searchSymptoms(query, language);
  }
}