import { BadRequestException } from '@nestjs/common';
import { ExeOptions } from 'src';
import { SoftDeleteQueryBuilder } from 'typeorm/query-builder/SoftDeleteQueryBuilder';
import { camelcaseKeys } from './camelcase';

SoftDeleteQueryBuilder.prototype.exe = async function <Entity>(
  this: SoftDeleteQueryBuilder<Entity>,
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
