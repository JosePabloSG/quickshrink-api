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
 * Entity representing a click event on a shortened URL
 * Tracks analytics and user interaction data
 */
@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  clickedAt: Date;

  @Column({ length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @ManyToOne(() => Url, (url) => url.clicks, { nullable: false })
  @JoinColumn({ name: 'url_id' })
  url: Url;
}
