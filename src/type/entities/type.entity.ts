import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'

@Entity('type')
export class Type extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string
}
