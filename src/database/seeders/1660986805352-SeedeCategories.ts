import { MigrationInterface, QueryRunner } from 'typeorm'
import { Categories } from 'src/categories/entities/categories.entity'

export class SeedeCategories1660986805352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<Categories>(Categories, [
        { name: 'กลุ่มหวยไทย', code: 'TH' },
        { name: 'กลุ่มหวยต่างประเทศ', code: 'AB' }
      ])
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM categories`)
  }
}
