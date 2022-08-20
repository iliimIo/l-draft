import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddGroupToRound1660975835309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'round',
      new TableColumn({
        name: 'group_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'round',
      new TableForeignKey({
        name: 'group',
        columnNames: ['group_id'],
        referencedTableName: 'group',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('round', 'group')
    await queryRunner.dropColumn('round', 'group_id')
  }
}
