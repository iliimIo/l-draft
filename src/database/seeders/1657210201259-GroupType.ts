import { MigrationInterface, QueryRunner } from 'typeorm'
import { Group } from 'src/group/entities/group.entity'
import { Categories } from 'src/categories/entities/categories.entity'

export class GroupType1657210201259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<Group>(Group, [
        { name: 'หวยไทย', code: 'TH', categories: await Categories.findOne({ name: 'กลุ่มหวยไทย' }) },
        { name: 'หวยลาวพัฒนา', code: 'LA', categories: await Categories.findOne({ name: 'กลุ่มหวยต่างประเทศ' }) },
        { name: 'หวยลาวเที่ยง', code: 'LAA', categories: await Categories.findOne({ name: 'กลุ่มหวยต่างประเทศ' }) },
        { name: 'หวยลาวเช้า', code: 'LAM', categories: await Categories.findOne({ name: 'กลุ่มหวยต่างประเทศ' }) }
      ])
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM group`)
  }
}
