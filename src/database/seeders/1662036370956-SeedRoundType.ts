import { MigrationInterface, QueryRunner } from 'typeorm'
import { RoundType } from 'src/round-type/entities/round-type.entity'

export class SeedRoundType1662036370956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<RoundType>(RoundType, [{ name: 'วันที่' }, { name: 'วัน' }])
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM round_type`)
  }
}
