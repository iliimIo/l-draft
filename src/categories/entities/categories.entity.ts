import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany, Index } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Award } from 'src/award/entities/award.entity'

@Entity('categories')
@Index('IDX_CATEGORIES_ID')
export class Categories extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  code: string

  @ApiProperty()
  @Column({ name: 'is_public', default: true, nullable: true })
  isPublic: boolean

  // ---------- start relation ----------//
  @OneToMany(() => Award, (award) => award.categories)
  @JoinColumn({ name: 'award_id' })
  award: Award[]

  // ---------- end relation ----------//
}
