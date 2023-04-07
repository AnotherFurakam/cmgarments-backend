import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GetRelationSizes {
  @Expose()
  relation_size: String[]

  constructor(relation_size: string[]) {
    this.relation_size = relation_size;
  }
}
