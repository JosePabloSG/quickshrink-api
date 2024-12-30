import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCodesController } from './qr-codes.controller';
import { QrCodesService } from './qr-codes.service';
import { QrCode } from './entities/qr-code.entity';
import { QrCodeRepository } from './repository/qr-code.repository';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [TypeOrmModule.forFeature([QrCode]), UrlsModule],
  controllers: [QrCodesController],
  providers: [QrCodesService, QrCodeRepository],
  exports: [QrCodesService],
})
export class QrCodesModule {}
