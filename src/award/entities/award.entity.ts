import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'

@Entity('award')
export class Award extends Base {
  @ApiProperty()
  @Column({ nullable: false })
  number: number

  @ApiProperty()
  @Column({ name: 'period_date', unique: true, nullable: false })
  periodDate: Date
}
