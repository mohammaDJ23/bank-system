import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  statusCode: number;
}
