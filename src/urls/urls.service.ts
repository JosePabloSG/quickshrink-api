import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UrlRepository } from './repository/url.repository';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from './entities/url.entity';
import { UsersService } from '../users/users.service';
import { FindManyOptions } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UrlsService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new shortened URL
   * @param createUrlDto - URL creation data transfer object
   * @param userId - ID of the user creating the URL
   * @returns Newly created URL entity
   * @throws ConflictException if custom alias already exists
   * @throws NotFoundException if user not found
   */
  async create(createUrlDto: CreateUrlDto, email: string): Promise<Url> {
    // Validate email parameter
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // Find user and handle potential null case
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Check if custom alias is already taken
    if (createUrlDto.customAlias) {
      const existingUrl = await this.urlRepository.findByCondition({
        where: { customAlias: createUrlDto.customAlias },
      });
      if (existingUrl) {
        throw new ConflictException('Custom alias already in use');
      }
    }

    // Generate short code if no custom alias
    const shortCode = createUrlDto.customAlias || this.generateShortCode();

    // Set expiration date to 7 days from now if not provided
    const defaultExpirationDate = new Date();
    defaultExpirationDate.setDate(defaultExpirationDate.getDate() + 7);

    // Create and save URL entity
    const url = this.urlRepository.create({
      ...createUrlDto,
      shortCode,
      user,
      isActive: true,
      expirationDate: createUrlDto.expirationDate || defaultExpirationDate,
    });

    return await this.urlRepository.save(url);
  }

  /**
   * Retrieves all URLs for a specific user
   * @param userId - ID of the user
   * @returns Array of URLs belonging to the user
   */
  async findAllByUser(email: string): Promise<Url[]> {
    // Validate email parameter
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // Find user and handle potential null case
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const options: FindManyOptions<Url> = {
      where: { user: { id: user.id } },
      relations: ['user', 'qrCode'],
      order: { createdAt: 'DESC' },
    };
    return await this.urlRepository.findAll(options);
  }

  /**
   * Finds a URL by its ID
   * @param id - URL ID
   * @param userId - Optional user ID to verify ownership
   * @returns URL if found
   * @throws NotFoundException if URL not found or doesn't belong to user
   */
  async findOne(id: number, userId?: number): Promise<Url> {
    const url = await this.urlRepository.findByCondition({
      where: { id },
      relations: ['user', 'qrCode'],
    });

    if (!url) {
      throw new NotFoundException(`URL with ID ${id} not found`);
    }

    if (userId && url.user.id !== userId) {
      throw new NotFoundException(`URL not found for this user`);
    }

    return url;
  }

  /**
   * Updates a URL's information
   * @param id - URL ID
   * @param updateUrlDto - URL update data transfer object
   * @param userId - User ID to verify ownership
   * @returns Updated URL
   * @throws NotFoundException if URL not found or doesn't belong to user
   * @throws ConflictException if custom alias already exists
   */
  async update(
    id: number,
    updateUrlDto: UpdateUrlDto,
    email: string,
  ): Promise<Url> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // Find user and handle potential null case
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const userId = user.id;
    const url = await this.findOne(id, userId);
    if (
      updateUrlDto.customAlias &&
      updateUrlDto.customAlias !== url.customAlias
    ) {
      const existingUrl = await this.urlRepository.findByCondition({
        where: { customAlias: updateUrlDto.customAlias },
      });
      if (existingUrl) {
        throw new ConflictException('Custom alias already in use');
      }
    }

    Object.assign(url, updateUrlDto);
    return await this.urlRepository.save(url);
  }

  /**
   * Removes a URL from the system
   * @param id - URL ID
   * @param userId - User ID to verify ownership
   * @throws NotFoundException if URL not found or doesn't belong to user
   */
  async remove(id: number, email: string): Promise<void> {
    // Validate email parameter
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // Find user and handle potential null case
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const userId = user.id;
    const url = await this.findOne(id, userId);
    await this.urlRepository.remove(url);
  }
  /**
   * Finds a URL's original destination by its short code or custom alias
   * @param code - Short code or custom alias
   * @returns Original URL string if found and active
   * @throws NotFoundException if URL not found or inactive
   * @throws BadRequestException if URL has expired
   */
  async findByShortCode(code: string): Promise<string> {
    const url = await this.urlRepository.findByCondition({
      where: [{ shortCode: code }, { customAlias: code }],
      relations: ['user'],
    });

    if (!url || !url.isActive) {
      throw new NotFoundException('URL not found or inactive');
    }

    console.log(url.isActive);

    if (url.expirationDate && url.expirationDate < new Date()) {
      url.isActive = false;
      await this.urlRepository.save(url);
      throw new BadRequestException('URL has expired');
    }

    if (url.password) {
      return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/protect/${url.shortCode}`;
    }

    console.log(url.originalUrl);
    return url.originalUrl;
  }

  async verifyPassword(code: string, password: string): Promise<string> {
    const url = await this.urlRepository.findByCondition({
      where: [{ shortCode: code }, { customAlias: code }],
      relations: ['user'],
    });

    if (!url || !url.isActive) {
      throw new NotFoundException('URL not found or inactive');
    }

    if (url.password !== password) {
      throw new BadRequestException('Invalid password');
    }

    return url.originalUrl;
  }

  /**
   * Generates a random short code for URL
   * @returns Generated short code
   * @private
   */
  private generateShortCode(): string {
    return crypto.randomBytes(4).toString('base64url');
  }
}
