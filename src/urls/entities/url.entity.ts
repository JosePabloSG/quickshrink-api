import { Click } from 'src/clicks/entities/click.entity';
import { QrCode } from 'src/qr-codes/entities/qr-code.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

/**
 * URL Entity
 *
 * Represents a shortened URL in the system with all its associated metadata and relationships.
 * This entity handles URL shortening, tracking, and user associations.
 *
 * @class Url
 * @Entity urls - Database table name
 */
@Entity('urls')
export class Url {
  /**
   * Primary key identifier for the URL
   * Auto-generated sequential number
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The complete original URL that was shortened
   * Maximum length: 2083 characters (standard URL length limit)
   * Cannot be null
   */
  @Column({ length: 2083, nullable: false })
  originalUrl: string;

  /**
   * Unique generated short code for accessing the URL
   * Maximum length: 50 characters
   * Must be unique and cannot be null
   */
  @Column({ length: 50, nullable: false, unique: true })
  shortCode: string;

  /**
   * Optional custom alias for the shortened URL
   * Maximum length: 50 characters
   * Must be unique if provided
   */
  @Column({ length: 50, nullable: true, unique: true })
  customAlias?: string;

  /**
   * Optional expiration date for the URL
   * After this date, the URL will no longer be accessible
   */
  @Column({ type: 'datetime', nullable: true })
  expirationDate?: Date;

  /**
   * Counter for the number of times the URL has been accessed
   * Defaults to 0
   */
  @Column({ default: 0 })
  clickCount: number;

  /**
   * Optional password protection for the URL
   * Stores encrypted password
   * Maximum length: 255 characters
   */
  @Column({ length: 255, nullable: true })
  password?: string;

  /**
   * Timestamp when the URL was created
   * Automatically set by TypeORM
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the URL was last updated
   * Automatically updated by TypeORM
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Indicates if the URL is currently active and accessible
   * Defaults to true
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * One-to-Many relationship with Click entities
   * Tracks all clicks/visits to this URL
   * @see Click
   */
  @OneToMany(() => Click, (click) => click.url)
  clicks: Click[];

  /**
   * One-to-Many relationship with QrCode entities
   * Stores all QR code versions generated for this URL
   * @see QrCode
   */
  @OneToMany(() => QrCode, (qrCode) => qrCode.url)
  qrCodes: QrCode[];

  /**
   * Many-to-Many relationship with User entities
   * Manages URL ownership and sharing between users
   * Uses 'user_urls' as junction table
   * @see User
   */
  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_urls',
    joinColumn: {
      name: 'url_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
