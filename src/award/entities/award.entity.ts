import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'
import { Categories } from 'src/categories/entities/categories.entity'
import { Group } from 'src/group/entities/group.entity'
import { Type } from 'src/type/entities/type.entity'

@Entity('award')
export class Award extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  number: number

  @ApiProperty()
  @Column({ name: 'period_date', unique: true, nullable: false })
  periodDate: Date

  // ---------- start relation ----------//

  @ManyToOne(() => Categories, (categories) => categories.award)
  @JoinColumn({ name: 'categories_id' })
  categories: Categories

  @ManyToOne(() => Group, (group) => group.award)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @ManyToOne(() => Type, (type) => type.award)
  @JoinColumn({ name: 'type_id' })
  type: Type

  // ---------- end relation ----------//
}
