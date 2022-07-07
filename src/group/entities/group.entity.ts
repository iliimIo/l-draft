import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'

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
}
