import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUrl,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://www.example.com/very-long-url',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @MaxLength(2083)
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the shortened URL',
    example: 'my-custom-url',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  customAlias?: string;

  @ApiPropertyOptional({
    description: 'Optional password protection for the URL',
    example: 'mySecurePassword123',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the URL',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  expirationDate?: Date;
}
