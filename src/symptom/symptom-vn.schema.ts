import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

export type SymptomVNDocument = SymptomVN & Document;

@Schema()
@ObjectType()
export class SymptomVN {
  @Field()
  @Prop({ required: true })
  symptom: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ required: true })
  possibleConditions: string;

  @Field()
  @Prop({ required: true })
  source: string;

  @Field({ nullable: true })
  @Prop()
  sourceLink?: string;

  @Field()
  @Prop({ required: true })
  severityLevel: string;

  @Field()
  @Prop({ required: true })
  recommendedAction: string;
}

export const SymptomVNSchema = SchemaFactory.createForClass(SymptomVN);