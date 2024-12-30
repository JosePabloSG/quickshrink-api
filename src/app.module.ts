import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';
import { ClicksModule } from './clicks/clicks.module';
import { QrCodesModule } from './qr-codes/qr-codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    DbModule,
    UsersModule,
    UrlsModule,
    ClicksModule,
    QrCodesModule,
  ],
})
export class AppModule {}
