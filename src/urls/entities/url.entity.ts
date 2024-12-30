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
  OneToOne,
  ManyToOne,
  JoinColumn,
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2083, nullable: false })
  originalUrl: string;

  @Column({ length: 50, nullable: false, unique: true })
  shortCode: string;

  @Column({ length: 50, nullable: true, unique: true })
  customAlias?: string;

  @Column({ type: 'datetime', nullable: true })
  expirationDate?: Date;

  @Column({ default: 0 })
  clickCount: number;

  @Column({ length: 255, nullable: true })
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.urls, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Click, (click) => click.url)
  clicks: Click[];

  @OneToOne(() => QrCode, (qrCode) => qrCode.url)
  qrCode: QrCode;
}
