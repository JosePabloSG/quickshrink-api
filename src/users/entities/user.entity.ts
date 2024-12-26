import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Url } from '../../urls/entities/url.entity';

/**
 * Entity representing a user in the system
 * Manages authentication and URL ownership
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User's email address, used for authentication
   * Must be unique across the system
   */
  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  /**
   * Encrypted password for local authentication
   * Only required if not using OAuth
   */
  @Column({ length: 255, nullable: true })
  password?: string;

  /**
   * Authentication provider type
   */
  @Column({
    type: 'enum',
    enum: ['google', 'github', 'email'],
    nullable: false,
  })
  authProvider: 'google' | 'github' | 'email';

  /**
   * Timestamp of user creation
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp of last user update
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Collection of URLs associated with this user
   */
  @ManyToMany(() => Url, (url) => url.users)
  urls: Url[];
}
