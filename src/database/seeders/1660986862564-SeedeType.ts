import { MigrationInterface, QueryRunner } from 'typeorm'
import { AwardType } from 'src/award-type/entities/award-type.entity'

export class SeedeType1660986862564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<AwardType>(AwardType, [
        { name: 'รางวัลที่ 1', digit: 6 },
        { name: '3 ตัวบน', digit: 3 },
        { name: '3 ตัวล่าง', digit: 3 },
        { name: '3 โต๊ด', digit: 3 },
        { name: '3 ตัวหน้า', digit: 3 },
        { name: '2 ตัวบน', digit: 2 },
        { name: '2 ตัวล่าง', digit: 2 },
        { name: '2 ตัวโต๊ด', digit: 2 },
        { name: '2 ตัวหน้า', digit: 2 },
        { name: 'วิ่งบน', digit: 1 },
        { name: 'วิ่งล่าง', digit: 1 }
      ])
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM type`)
  }
}
