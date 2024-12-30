import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user
   * @param createUserDto User creation data transfer object
   * @returns Newly created user
   * @throws ConflictException if email already exists
   * @throws BadRequestException if email format is invalid
   */

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!isEmail(createUserDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Retrieves all users
   * @returns Array of all users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Finds a user by their ID
   * @param id User ID
   * @returns User if found
   * @throws NotFoundException if user not found
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates a user's information
   * @param id User ID
   * @param updateUserDto User update data transfer object
   * @returns Updated user
   * @throws NotFoundException if user not found
   * @throws ConflictException if email already exists
   * @throws BadRequestException if email format is invalid
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      if (!isEmail(updateUserDto.email)) {
        throw new BadRequestException('Invalid email format');
      }

      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already registered');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Removes a user from the system
   * @param id User ID
   * @returns void
   * @throws NotFoundException if user not found
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /**
   * Finds a user by their email
   * @param email User email
   * @returns User if found
   * @throws BadRequestException if email format is invalid
   */
  async findByEmail(email: string): Promise<User | undefined> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
    return await this.userRepository.findOne({ where: { email } });
  }
}
