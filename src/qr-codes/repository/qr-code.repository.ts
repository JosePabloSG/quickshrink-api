import { BaseAbstractRepostitory } from '@repositories/repository/base.repository';
import { QrCode } from '../entities/qr-code.entity';
import { QrCodeRepositoryInterface } from './qr-code.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class QrCodeRepository
  extends BaseAbstractRepostitory<QrCode>
  implements QrCodeRepositoryInterface
{
  constructor(
    @InjectRepository(QrCode)
    private readonly QrCodeGenericRepository: Repository<QrCode>,
  ) {
    super(QrCodeGenericRepository);
  }
}
