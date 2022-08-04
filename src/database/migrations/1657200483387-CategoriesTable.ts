import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CategoriesTable1657200483387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'code',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: true
          },
          {
            name: 'is_public',
            type: 'boolean',
            default: true
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'categories',
      new TableIndex({
        name: 'IDX_CATEGORIES_ID',
        columnNames: ['id']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories')
  }
}
