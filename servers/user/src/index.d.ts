import { UpdateResult } from 'typeorm';

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
