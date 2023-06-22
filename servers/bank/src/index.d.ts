import 'typeorm/query-builder/SoftDeleteQueryBuilder';
import 'typeorm/query-builder/InsertQueryBuilder';
import 'typeorm/query-builder/UpdateQueryBuilder';
import 'typeorm/query-builder/DeleteQueryBuilder';
import { QueryBuilder } from 'typeorm';

interface CustomQueryBuilder<Entity> {
  exe<E extends Entity = Entity>(
    this: QueryBuilder<Entity>,
    options?: ExeOptions,
  ): Promise<E>;
}

interface ExeOptions {
  camelcase: boolean;
}

declare module 'typeorm/query-builder/SoftDeleteQueryBuilder' {
  interface SoftDeleteQueryBuilder<Entity> extends CustomQueryBuilder<Entity> {}
}

declare module 'typeorm/query-builder/InsertQueryBuilder' {
  interface InsertQueryBuilder<Entity> extends CustomQueryBuilder<Entity> {}
}

declare module 'typeorm/query-builder/UpdateQueryBuilder' {
  interface UpdateQueryBuilder<Entity> extends CustomQueryBuilder<Entity> {}
}

declare module 'typeorm/query-builder/DeleteQueryBuilder' {
  interface DeleteQueryBuilder<Entity> extends CustomQueryBuilder<Entity> {}
}
