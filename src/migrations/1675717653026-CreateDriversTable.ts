import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDriversTable1675717653026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `drivers` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `phoneNumber` varchar(255) NOT NULL, `suspendedAt` datetime DEFAULT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `isSuspended` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (`id`), UNIQUE KEY `IDX_a83b197c2a07072bb8b52b7f02` (`phoneNumber`));",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `drivers`');
  }
}
