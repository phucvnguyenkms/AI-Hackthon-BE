
import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class SymptomInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  severity: number; // 1, 2, 3
}

@ObjectType()
export class SymptomResult {
  @Field()
  Symptom: string;

  @Field()
  Description: string;

  @Field()
  PossibleConditions: string;

  @Field()
  Source: string;

  @Field({ nullable: true })
  SourceLink?: string;

  @Field()
  SeverityLevel: string;

  @Field()
  RecommendedAction: string;
}