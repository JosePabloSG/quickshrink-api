import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUrlDto } from './create-url.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @ApiPropertyOptional({
    description: 'Whether the URL is active or not',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
