import { UpdateResult } from 'typeorm';
import { SoftDeleteQueryBuilder } from 'typeorm/query-builder/SoftDeleteQueryBuilder';
import { camelCase } from 'typeorm/util/StringUtils';

SoftDeleteQueryBuilder.prototype.getCamelcasedRawOne = async function <Entity>(
  this: SoftDeleteQueryBuilder<Entity>,
): Promise<UpdateResult> {
  const updatedResult = await this.execute();

  if (Array.isArray(updatedResult.raw)) {
    updatedResult.raw.forEach((item: Record<string, any>) => {
      if (typeof item === 'object' && Object.keys(item).length)
        for (let key in item)
          if (camelCase(key) !== key) {
            item[camelCase(key)] = item[key];
            delete item[key];
          }
    });
  }

  updatedResult.raw[0] = updatedResult.raw[0] || {};

  return updatedResult;
};
