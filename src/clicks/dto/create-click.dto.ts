import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClickDto {
  @ApiProperty({
    description: 'The unique identifier of the URL',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  urlId: string;

  @ApiProperty({
    description: 'IP address of the visitor',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent string of the visitor',
    example: 'Mozilla/5.0...',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
