import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany, Index, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Award } from 'src/award/entities/award.entity'
import { Categories } from 'src/categories/entities/categories.entity'

@Entity('group')
@Index('IDX_GROUP_ID')
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

  // ---------- start relation ----------//

  @OneToMany(() => Award, (award) => award.group)
  @JoinColumn({ name: 'award_id' })
  award: Award[]

  // ---------- end relation ----------//
  @Index('IDX_CATEGORIES_ID')
  @ManyToOne(() => Categories, (categories) => categories.group)
  @JoinColumn({ name: 'categories_id' })
  categories: Categories
}
