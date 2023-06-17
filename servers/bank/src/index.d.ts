import { UpdateResult } from 'typeorm';
import { UpdateResult } from 'typeorm/query-builder/InsertQueryBuilder';

interface ExeOptions {
  camelcase: boolean;
}

declare module 'typeorm/query-builder/SoftDeleteQueryBuilder' {
  interface SoftDeleteQueryBuilder<Entity> {
    exe<E extends Entity = Entity>(
      this: SoftDeleteQueryBuilder<Entity>,
      options?: ExeOptions,
    ): Promise<E>;
  }
}

declare module 'typeorm/query-builder/InsertQueryBuilder' {
  interface InsertQueryBuilder<Entity> {
    exe<E extends Entity = Entity>(
      this: InsertQueryBuilder<Entity>,
      options?: ExeOptions,
    ): Promise<E>;
  }
}
