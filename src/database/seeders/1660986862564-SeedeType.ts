import { MigrationInterface, QueryRunner } from 'typeorm'
import { AwardType } from 'src/type/entities/award-type.entity'

export class SeedeType1660986862564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<AwardType>(AwardType, [
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
