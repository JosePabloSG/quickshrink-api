import { Module } from '@nestjs/common';
import { ClicksController } from './clicks.controller';
import { ClicksService } from './clicks.service';
import { Click } from './entities/click.entity';
import { Url } from 'src/urls/entities/url.entity';
import { ClickRepository } from './repository/click.repository';
import { UrlRepository } from 'src/urls/repository/url.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Click, Url])],
  controllers: [ClicksController],
  providers: [ClicksService, ClickRepository, UrlRepository],
})
export class ClicksModule {}
