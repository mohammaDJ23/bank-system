import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

export function excpetion(error: any) {
  switch (error.statusCode) {
    case 409:
      throw new ConflictException(error.message);

    case 404:
      throw new NotFoundException(error.message);

    default:
      throw new BadRequestException(error.message || error);
  }
}
