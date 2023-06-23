import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class NewOrder1684952252915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'kafka_new_order',
      new TableColumn({
        name: 'attempts',
        type: 'int',
        default: 0,
        unsigned: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('kafka_new_order', 'attempts');
  }
}
