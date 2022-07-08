import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Award } from 'src/award/entities/award.entity'

@Entity('group')
export class Group extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  code: string

  @ApiProperty()
  @Column({ nullable: true })
  logo: string

  @ApiProperty()
  @Column({ name: 'is_public', default: true, nullable: true })
  isPublic: boolean

  // ---------- start relation ----------//

  @OneToMany(() => Award, (award) => award.group)
  @JoinColumn({ name: 'award_id' })
  award: Award[]

  // ---------- end relation ----------//
}
