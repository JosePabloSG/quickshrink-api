import { BaseAbstractRepostitory } from '@repositories/repository/base.repository';
import { Url } from '../entities/url.entity';
import { UrlRepositoryInterface } from './url.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UrlRepository
  extends BaseAbstractRepostitory<Url>
  implements UrlRepositoryInterface
{
  constructor(
    @InjectRepository(Url)
    private readonly UrlGenericRepository: Repository<Url>,
  ) {
    super(UrlGenericRepository);
  }
}
