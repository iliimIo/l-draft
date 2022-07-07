import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddTypeToAward1657213596036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'award',
      new TableColumn({
        name: 'type_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'award',
      new TableForeignKey({
        name: 'type',
        columnNames: ['type_id'],
        referencedTableName: 'type',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('award', 'type')
    await queryRunner.dropColumn('award', 'type_id')
  }
}
