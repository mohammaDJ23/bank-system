import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExeOptions } from 'src';
import { SelectQueryBuilder, QueryBuilder } from 'typeorm';
import { SoftDeleteQueryBuilder } from 'typeorm/query-builder/SoftDeleteQueryBuilder';
import { camelcaseKeys } from './camelcase';

async function exe<Entity>(
  this: QueryBuilder<Entity>,
  options: ExeOptions = {},
) {
  options.camelcase = options.camelcase ?? true;

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

SelectQueryBuilder.prototype.getOneOrFail = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
) {
  const entity = await this.getOne();
  if (!entity) {
    throw new NotFoundException('Could not be found the entity');
  }
  return entity;
};

SoftDeleteQueryBuilder.prototype.exe = exe;
