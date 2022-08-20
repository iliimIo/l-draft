import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddAwardTypeToExchangeRate1661017934164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'exchange_rate',
      new TableColumn({
        name: 'award_type_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'exchange_rate',
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
    await queryRunner.dropForeignKey('exchange_rate', 'award_type')
    await queryRunner.dropColumn('exchange_rate', 'award_type_id')
  }
}
