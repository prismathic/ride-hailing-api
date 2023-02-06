import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRidesTable1675717900851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `rides` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `driverId` varchar(36) DEFAULT NULL, `passengerId` varchar(36) DEFAULT NULL, `status` varchar(255) NOT NULL, `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `pickupPoint` varchar(255) NOT NULL, `destinationPoint` varchar(255) NOT NULL, PRIMARY KEY (`id`), KEY `FK_0adda088d567495e71d21b6c691` (`driverId`), KEY `FK_6bf2d633c1f19708b7998b9e6da` (`passengerId`), CONSTRAINT `FK_0adda088d567495e71d21b6c691` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`), CONSTRAINT `FK_6bf2d633c1f19708b7998b9e6da` FOREIGN KEY (`passengerId`) REFERENCES `passengers` (`id`));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `rides`');
  }
}
