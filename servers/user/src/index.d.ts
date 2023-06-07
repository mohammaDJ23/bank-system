import { UpdateResult } from 'typeorm';

declare module 'typeorm/query-builder/SoftDeleteQueryBuilder' {
  interface SoftDeleteQueryBuilder<Entity> {
    getCamelcasedRawOne(
      this: SoftDeleteQueryBuilder<Entity>,
    ): Promise<UpdateResult>;
  }
}
