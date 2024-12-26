import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Url } from '../../urls/entities/url.entity';

/**
 * Entity representing a QR code generated for a URL
 * Stores QR code image data and metadata
 */
@Entity('qr_codes')
export class QrCode {
  /**
   * Unique identifier for the QR code
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the associated URL
   */
  @ManyToOne(() => Url, { nullable: false })
  @JoinColumn({ name: 'url_id' })
  url: Url;

  /**
   * QR code image data stored as base64 or URL
   */
  @Column({ type: 'text', nullable: false })
  qrCodeImage: string;

  /**
   * Timestamp of QR code generation
   */
  @CreateDateColumn()
  createdAt: Date;
}
