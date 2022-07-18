import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'
import { Type } from 'src/type/entities/type.entity'

@Entity('award')
@Index('IDX_AWARD_ID')
export class Award extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  number: string

  @ApiProperty()
  @Column({ name: 'period_date', unique: false, nullable: false })
  periodDate: Date

  // ---------- start relation ----------//
  @Index('IDX_GROUP_ID')
  @ManyToOne(() => Group, (group) => group.award)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @Index('IDX_TYPE_ID')
  @ManyToOne(() => Type, (type) => type.award)
  @JoinColumn({ name: 'type_id' })
  type: Type

  // ---------- end relation ----------//
}
