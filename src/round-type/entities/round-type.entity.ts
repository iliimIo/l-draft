import { ApiProperty } from '@nestjs/swagger'
import { Base } from 'src/common/base/entities/base.entity'
import { Round } from 'src/round/entities/round.entity'
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm'

@Entity('round_type')
// @Index('IDX_ROUND_TYPE_ID')
export class RoundType extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  // ---------- start relation ----------//

  @OneToMany(() => Round, (round) => round.roundType)
  @JoinColumn({ name: 'round_id' })
  round: Round

  // ---------- end relation ----------//
}
