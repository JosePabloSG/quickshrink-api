import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UrlRepository } from './repository/url.repository';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from './entities/url.entity';
import { DataSource } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UrlsService {
  constructor(
    private readonly urlsRepository: UrlRepository,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(UrlsService.name);

  private generateShortCode(length: number = 6): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  private async isShortCodeUnique(shortCode: string): Promise<boolean> {
    const existingUrl = await this.urlsRepository.findOne({
      where: { shortCode },
    });
    return !existingUrl;
  }

  async create(
    createUrlDto: CreateUrlDto,
  ): Promise<{ message: string; url: Url }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si la URL ya existe
      const existingUrl = await this.urlsRepository.findOne({
        where: { originalUrl: createUrlDto.originalUrl },
      });

      if (existingUrl) {
        throw new BadRequestException('URL already exists');
      }

      // Generate unique short code
      let shortCode: string;
      do {
        shortCode = this.generateShortCode();
      } while (!(await this.isShortCodeUnique(shortCode)));

      // Create new URL entity
      const newUrl = this.urlsRepository.create({
        ...createUrlDto,
        shortCode,
      });

      const savedUrl = await queryRunner.manager.save(newUrl);
      await queryRunner.commitTransaction();

      return {
        message: 'URL created successfully',
        url: savedUrl,
      };
    } catch (error) {
      this.logger.error(`Error al crear URL: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error creating URL');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.urlsRepository.findAll();
  }

  async findOne(id: number) {
    return this.urlsRepository.findOneById(id);
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    try {
      const url = await this.urlsRepository.findOneById(id);
      if (!url) {
        throw new BadRequestException('URL not found');
      }

      return await this.urlsRepository.save({
        ...url,
        ...updateUrlDto,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating URL:', error);
      throw new InternalServerErrorException('Failed to update URL');
    }
  }

  async remove(id: string) {
    try {
      const url = await this.urlsRepository.findOneById(id);
      if (!url) {
        throw new BadRequestException('URL not found');
      }

      return await this.urlsRepository.remove(url);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error deleting URL:', error);
      throw new InternalServerErrorException('Failed to delete URL');
    }
  }
}
