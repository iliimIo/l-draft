import { ApiProperty } from '@nestjs/swagger'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'
import { RoundType } from 'src/round-type/entities/round-type.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

@Entity('round')
@Index('IDX_ROUND_ID')
export class Round extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ name: 'start_date', unique: false, nullable: false })
  startDate: Date

  @ApiProperty()
  @Column({ name: 'end_date', unique: false, nullable: false })
  endDate: Date

  @ApiProperty()
  @Column({ unique: false, nullable: true })
  day: string

  @ApiProperty()
  @Column({ unique: false, nullable: true })
  date: string

  // ---------- start relation ----------//

  @ManyToOne(() => Group, (group) => group.round)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @ManyToOne(() => RoundType, (roundType) => roundType.round)
  @JoinColumn({ name: 'round_type_id' })
  roundType: RoundType

  // ---------- end relation ----------//
}
