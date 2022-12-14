import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Base extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column({ name: 'is_active', default: true, nullable: true })
  isActive: boolean

  @ApiProperty()
  @Column({ name: 'is_enabled', default: true, nullable: true })
  isEnabled: boolean

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 3, default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date
}
