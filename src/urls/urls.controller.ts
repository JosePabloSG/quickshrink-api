import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@ApiTags('urls')
@Controller('urls')
@ApiBearerAuth()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new shortened URL' })
  @ApiResponse({ status: 201, description: 'URL successfully created' })
  @ApiResponse({ status: 409, description: 'Custom alias already in use' })
  async create(@Body() createUrlDto: CreateUrlDto, @Request() req) {
    console.log(req.user.email);
    return await this.urlsService.create(createUrlDto, req.user.email);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all URLs for authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns all URLs for the user' })
  async findAll(@Request() req) {
    return await this.urlsService.findAllByUser(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get URL by ID' })
  @ApiResponse({ status: 200, description: 'Returns the URL if found' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.urlsService.findOne(+id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update URL by ID' })
  @ApiResponse({ status: 200, description: 'URL successfully updated' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({ status: 409, description: 'Custom alias already in use' })
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Request() req,
  ) {
    return await this.urlsService.update(+id, updateUrlDto, req.user.email);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete URL by ID' })
  @ApiResponse({ status: 200, description: 'URL successfully deleted' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return await this.urlsService.remove(+id, req.user.email);
  }

  @Get('redirect/:code')
  @ApiOperation({
    summary: 'Get original URL by short code',
    description: 'Returns the original URL for client-side redirection',
  })
  @ApiResponse({ status: 404, description: 'URL not found or inactive' })
  @ApiResponse({ status: 400, description: 'URL has expired' })
  async getOriginalUrl(@Param('code') code: string) {
    const originalUrl = await this.urlsService.findByShortCode(code);
    return { url: originalUrl };
  }

  @ApiOperation({
    summary: 'Verify password for a short code',
    description: 'Returns the original URL if the password is correct',
  })
  @ApiResponse({ status: 404, description: 'URL not found or inactive' })
  @ApiResponse({ status: 400, description: 'Invalid password' })
  @Get(':code/verify-password/:password')
  async verifyPassword(
    @Param('code') code: string,
    @Param('password') password: string,
  ) {
    const originalUrl = await this.urlsService.verifyPassword(code, password);
    return { url: originalUrl };
  }
}
