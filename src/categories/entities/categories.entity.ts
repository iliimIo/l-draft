import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'

@Entity('categories')
@Index('IDX_CATEGORIES_ID')
export class Categories extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  code: string

  // @ApiProperty()
  // @Column({ name: 'is_public', default: true, nullable: true })
  // isPublic: boolean

  // ---------- start relation ----------//
  @OneToMany(() => Group, (group) => group.categories)
  @JoinColumn({ name: 'group_id' })
  group: Group[]
  // ---------- end relation ----------//
}
