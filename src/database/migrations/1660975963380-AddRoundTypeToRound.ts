import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddRoundTypeToRound1660975963380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'round',
      new TableColumn({
        name: 'round_type_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'round',
      new TableForeignKey({
        name: 'round_type',
        columnNames: ['round_type_id'],
        referencedTableName: 'round_type',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('round', 'round_type')
    await queryRunner.dropColumn('round', 'round_type_id')
  }
}
