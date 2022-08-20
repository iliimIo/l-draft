import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddGroupToExchangeRate1660976449431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'exchange_rate',
      new TableColumn({
        name: 'group_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'exchange_rate',
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
    await queryRunner.dropForeignKey('exchange_rate', 'group')
    await queryRunner.dropColumn('exchange_rate', 'group_id')
  }
}
