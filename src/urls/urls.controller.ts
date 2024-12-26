import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    return await this.urlsService.create(createUrlDto);
  }

  @Get()
  async findAll() {
    return await this.urlsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.urlsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return await this.urlsService.update(+id, updateUrlDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.urlsService.remove(id);
  }
}
