import { ApiProperty } from '@nestjs/swagger'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'
import { RoundType } from 'src/round-type/entities/round-type.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity('round')
export class Round extends Base {
  @ApiProperty()
  @Column({ nullable: true })
  name: string

  @ApiProperty()
  @Column({ name: 'reward_time', nullable: false })
  rewardTime: string

  @ApiProperty()
  @Column({ name: 'reward_day', nullable: true })
  rewardDay: string

  // @ApiProperty()
  // @Column({ name: 'round_day', nullable: true })
  // roundDay: string

  // ---------- start relation ----------//

  @ManyToOne(() => Group, (group) => group.round)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @ManyToOne(() => RoundType, (roundType) => roundType.round)
  @JoinColumn({ name: 'round_type_id' })
  roundType: RoundType

  // ---------- end relation ----------//
}
