import { BaseInterfaceRepository } from '@repositories/interface/base.interface';
import { User } from '../entities/user.entity';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;
