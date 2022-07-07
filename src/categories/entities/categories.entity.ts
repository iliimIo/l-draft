import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Base } from 'src/common/base/entities/base.entity'

@Entity('categories')
export class Categories extends Base {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  name: string

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  code: string

  // ---------- start relation ----------//

  // @OneToMany(() => User, (user) => user.role)
  // @JoinColumn({ name: 'users_id' })
  // user: User[]

  // ---------- end relation ----------//
}
