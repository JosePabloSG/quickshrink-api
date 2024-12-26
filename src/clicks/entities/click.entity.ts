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
  /**
   * Unique identifier for the click event
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
   * Timestamp when the URL was clicked
   */
  @CreateDateColumn({ type: 'datetime', nullable: false })
  clickedAt: Date;

  /**
   * IP address of the visitor
   * Supports both IPv4 and IPv6
   */
  @Column({ length: 45, nullable: true })
  ipAddress?: string;

  /**
   * Browser and device information of the visitor
   */
  @Column({ type: 'text', nullable: true })
  userAgent?: string;
}
