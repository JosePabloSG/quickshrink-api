import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Url } from '../../urls/entities/url.entity';

/**
 * Entity representing a QR code generated for a URL
 * Stores QR code image data and metadata
 */
@Entity('qr_codes')
export class QrCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  qrCodeImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Url, (url) => url.qrCode)
  @JoinColumn({ name: 'url_id' })
  url: Url;
}
