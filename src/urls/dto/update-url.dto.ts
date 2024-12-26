import { PartialType } from '@nestjs/swagger';
import { CreateUrlDto } from './create-url.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsUrl,
  IsOptional,
  IsDate,
  Length,
  Matches,
  IsBoolean,
} from 'class-validator';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @ApiPropertyOptional({
    description: 'Update the original URL',
    example: 'https://www.newurl.com/path',
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 2083)
  originalUrl?: string;

  @ApiPropertyOptional({
    description: 'Update custom alias',
    example: 'new-custom-alias',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  customAlias?: string;

  @ApiPropertyOptional({
    description: 'Update expiration date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  expirationDate?: Date;

  @ApiPropertyOptional({
    description: 'Update password protection',
    example: 'newSecurePassword123',
  })
  @IsOptional()
  @IsString()
  @Length(6, 50)
  password?: string;

  @ApiPropertyOptional({
    description: 'Update URL active status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
