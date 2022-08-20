import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'
import { AwardType } from 'src/award-type/entities/award-type.entity'

@Entity('award')
@Index('IDX_AWARD_ID')
export class Award extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  number: string

  @ApiProperty()
  @Column({ name: 'period_date', unique: false, nullable: false })
  periodDate: Date

  @ApiProperty()
  @Column({ nullable: false })
  no: number

  // ---------- start relation ----------//
  @Index('IDX_GROUP_ID')
  @ManyToOne(() => Group, (group) => group.award)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @Index('IDX_TYPE_ID')
  @ManyToOne(() => AwardType, (type) => type.award)
  @JoinColumn({ name: 'award_type_id' })
  type: AwardType

  // ---------- end relation ----------//
}
