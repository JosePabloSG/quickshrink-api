import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClickRepository } from './repository/click.repository';
import { DataSource } from 'typeorm';
import { UrlRepository } from 'src/urls/repository/url.repository';
import { CreateClickDto } from './dto/create-click.dto';
import { Click } from './entities/click.entity';

@Injectable()
export class ClicksService {
  constructor(
    private readonly clicksRepository: ClickRepository,
    private readonly urlRepository: UrlRepository,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(ClicksService.name);

  async registerClick(createClickDto: CreateClickDto): Promise<Click> {
    const { urlId, ipAddress, userAgent } = createClickDto;
    this.logger.log(`Iniciando registro de clic para URL ID: ${urlId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si la URL existe
      this.logger.debug(`Verificando existencia de URL con ID: ${urlId}`);
      const url = await this.urlRepository.findOneById(urlId);

      if (!url) {
        this.logger.warn(`URL con ID: ${urlId} no encontrada.`);
        throw new NotFoundException('URL not found');
      }

      this.logger.debug(`URL encontrada: ${JSON.stringify(url)}`);

      // Registrar clic
      const newClick = {
        url,
        ipAddress,
        userAgent,
        clickedAt: new Date(),
      };
      this.logger.debug(`Creando clic con datos: ${JSON.stringify(newClick)}`);
      const savedClick = await queryRunner.manager.save(Click, newClick);

      // Incrementar clickCount
      url.clickCount = (url.clickCount || 0) + 1;
      this.logger.debug(`Incrementando clickCount: ${url.clickCount}`);
      await queryRunner.manager.save(url);

      await queryRunner.commitTransaction();
      this.logger.log(
        `Clic registrado exitosamente: ${JSON.stringify(savedClick)}`,
      );
      return savedClick;
    } catch (error) {
      this.logger.error(
        `Error registrando clic: ${error.message}`,
        error.stack,
      );
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error registering click');
    } finally {
      await queryRunner.release();
    }
  }
}
