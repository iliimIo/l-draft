import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Group } from 'src/group/entities/group.entity'

@Entity('categories')
export class Categories extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: true })
  name: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  code: string

  // ---------- start relation ----------//
  @OneToMany(() => Group, (group) => group.categories)
  @JoinColumn({ name: 'group_id' })
  group: Group[]
  // ---------- end relation ----------//
}
