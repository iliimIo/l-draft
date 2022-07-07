import { MigrationInterface, QueryRunner } from 'typeorm'
import { Group } from 'src/group/entities/group.entity'

export class GroupType1657210201259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<Group>(Group, [
        { name: 'หวยไทย', code: 'TH' },
        { name: 'หวยลาวพัฒนา', code: 'LA' },
        { name: 'หวยลาวเที่ยง', code: 'LAA' },
        { name: 'หวยลาวเช้า', code: 'LAM' }
      ])
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM group`)
  }
}
