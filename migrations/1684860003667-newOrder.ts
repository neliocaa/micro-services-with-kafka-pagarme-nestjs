import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewOrder1684860003667 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'kafka_new_order',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'topic',
            type: 'varchar',
          },
          {
            name: 'order_id',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'offset',
            type: 'varchar',
          },
          {
            name: 'partition',
            type: 'int',
            default: 1,
          },
          {
            name: 'key',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'text',
            length: '65535',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'timestamp',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('kafka_new_order');
  }
}
