import { BaseAbstractRepostitory } from '@repositories/repository/base.repository';
import { Click } from '../entities/click.entity';
import { ClickRepositoryInterface } from './click.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ClickRepository
  extends BaseAbstractRepostitory<Click>
  implements ClickRepositoryInterface
{
  constructor(
    @InjectRepository(Click)
    private readonly ClickGenericRepository: Repository<Click>,
  ) {
    super(ClickGenericRepository);
  }
}
