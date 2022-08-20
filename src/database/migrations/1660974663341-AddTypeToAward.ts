import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddTypeToAward1660974663341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'award',
      new TableColumn({
        name: 'award_type_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'award',
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
    await queryRunner.dropForeignKey('award', 'award_type')
    await queryRunner.dropColumn('award', 'award_type_id')
  }
}
