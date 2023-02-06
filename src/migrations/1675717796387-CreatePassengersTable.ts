import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePassengersTable1675717796387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `passengers` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `phoneNumber` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`), UNIQUE KEY `IDX_3ffef05316c5e1cfac5856ffb3` (`phoneNumber`));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `passengers`');
  }
}
