import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  statusCode: number;
}
