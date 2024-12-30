import { BaseAbstractRepostitory } from '@repositories/repository/base.repository';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from './user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository
  extends BaseAbstractRepostitory<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly UserGenericRepository: Repository<User>,
  ) {
    super(UserGenericRepository);
  }
}
