import { BadRequestException } from '@nestjs/common';
import { ExeOptions } from 'src';
import { QueryBuilder } from 'typeorm';
import {
  DeleteQueryBuilder,
  UpdateQueryBuilder,
  InsertQueryBuilder,
} from 'typeorm';
import { camelcaseKeys } from './camelcase';

async function exe<Entity>(this: QueryBuilder<Entity>, options?: ExeOptions) {
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
}

InsertQueryBuilder.prototype.exe = exe;
UpdateQueryBuilder.prototype.exe = exe;
DeleteQueryBuilder.prototype.exe = exe;
