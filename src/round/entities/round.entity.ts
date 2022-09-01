import { ApiProperty } from '@nestjs/swagger'
import { Base } from 'src/common/base/entities/base.entity'
import { RoundType } from 'src/round-type/entities/round-type.entity'
import { Column, Entity, Index, JoinColumn, OneToMany, UpdateDateColumn } from 'typeorm'

@Entity('round')
@Index('IDX_ROUND_ID')
export class Round extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @UpdateDateColumn({ name: 'start_dete', nullable: true })
  startDate: Date

  @ApiProperty()
  @UpdateDateColumn({ name: 'end_date', nullable: true })
  endDate: Date

  @ApiProperty()
  @Column({ unique: false, nullable: true })
  day: string

  @ApiProperty()
  @Column({ unique: false, nullable: true })
  date: string

  // ---------- start relation ----------//

  @OneToMany(() => RoundType, (roundType) => roundType.id)
  @JoinColumn({ name: 'round_type_id' })
  roundType: RoundType[]

  // ---------- end relation ----------//
}
