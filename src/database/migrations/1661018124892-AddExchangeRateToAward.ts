import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddExchangeRateToAward1661018124892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'award',
      new TableColumn({
        name: 'exchange_rate_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'award',
      new TableForeignKey({
        name: 'exchange_rate',
        columnNames: ['exchange_rate_id'],
        referencedTableName: 'exchange_rate',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('award', 'exchange_rate')
    await queryRunner.dropColumn('award', 'exchange_rate_id')
  }
}
