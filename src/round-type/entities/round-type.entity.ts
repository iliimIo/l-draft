import { ApiProperty } from '@nestjs/swagger'
import { Base } from 'src/common/base/entities/base.entity'
import { Column, Entity, Index } from 'typeorm'

@Entity('round_type')
@Index('IDX_ROUND_TYPE_ID')
export class RoundType extends Base {
  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string
}
