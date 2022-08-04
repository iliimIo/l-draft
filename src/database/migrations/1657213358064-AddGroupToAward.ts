import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddGroupToAward1657213358064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'award',
      new TableColumn({
        name: 'group_id',
        type: 'uuid',
        isNullable: false
      })
    )
    await queryRunner.createForeignKey(
      'award',
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
    await queryRunner.dropForeignKey('award', 'group')
    await queryRunner.dropColumn('award', 'group_id')
  }
}
