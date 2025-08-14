import { Resolver, Mutation } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => String)
  async seedSymptomsFromVN(): Promise<string> {
    return this.seedService.seedSymptomsFromVN();
  }

  @Mutation(() => String)
  async seedSymptomsFromEN(): Promise<string> {
    return this.seedService.seedSymptomsFromEN();
  }
}