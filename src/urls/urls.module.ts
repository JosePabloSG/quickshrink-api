import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlRepository } from './repository/url.repository';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url]), UsersModule, AuthModule],
  controllers: [UrlsController],
  providers: [UrlsService, UrlRepository],
  exports: [UrlsService],
})
export class UrlsModule {}
