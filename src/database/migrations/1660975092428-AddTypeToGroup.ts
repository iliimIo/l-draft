import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddTypeToGroup1660975092428 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'group',
      new TableColumn({
        name: 'award_type_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'group',
      new TableForeignKey({
        name: 'award_type',
        columnNames: ['award_type_id'],
        referencedTableName: 'award_type',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('group', 'award_type')
    await queryRunner.dropColumn('group', 'award_type_id')
  }
}
