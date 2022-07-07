import { MigrationInterface, QueryRunner } from 'typeorm'
import { Type } from 'src/type/entities/type.entity'

export class SeedeType1657207905539 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<Type>(Type, [
        { name: 'รางวัลที่ 1' },
        { name: '2 ตัวบน' },
        { name: '2 ตัวล่าง' },
        { name: '3 ตัวบน' },
        { name: '3 ตัวล่าง' },
        { name: '3 ตัวหน้า' }
      ])
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM type`)
  }
}
