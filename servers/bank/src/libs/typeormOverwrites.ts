import { BadRequestException } from '@nestjs/common';
import { ExeOptions } from 'src';
import { InsertQueryBuilder } from 'typeorm/query-builder/InsertQueryBuilder';
import { camelcaseKeys } from './camelcase';

InsertQueryBuilder.prototype.exe = async function <Entity>(
  this: InsertQueryBuilder<Entity>,
  options?: ExeOptions,
): Promise<Entity> {
  const updatedResult = await this.execute();
  let [rawResult] = updatedResult.raw;

  if (typeof rawResult === 'undefined' || rawResult === null || !rawResult) {
    throw new BadRequestException('No affects applied.');
  }
  if (options.camelcase) {
    if (typeof rawResult === 'object') {
      return camelcaseKeys(rawResult);
    }
  }

  return rawResult;
};
