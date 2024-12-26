import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://www.verylongwebsite.com/very/long/path',
    maxLength: 2083,
  })
  @IsUrl()
  @Length(1, 2083)
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the shortened URL',
    example: 'my-custom-url',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message:
      'Custom alias can only contain letters, numbers, hyphens and underscores',
  })
  customAlias?: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the URL',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  expirationDate?: Date;

  @ApiPropertyOptional({
    description: 'Password to protect the URL access',
    example: 'mySecurePassword123',
  })
  @IsOptional()
  @IsString()
  @Length(6, 50)
  password?: string;

  @ApiPropertyOptional({
    description: 'Whether the URL is active upon creation',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
