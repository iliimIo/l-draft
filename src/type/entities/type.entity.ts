import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Award } from 'src/award/entities/award.entity'

@Entity('type')
export class Type extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  // ---------- start relation ----------//

  @OneToMany(() => Award, (award) => award.type)
  @JoinColumn({ name: 'award_id' })
  award: Award[]

  // ---------- end relation ----------//
}
