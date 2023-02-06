import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

export class SeedDefaultUser1675373731297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('it sha reached here.');
    const user = new User();

    user.password = await bcrypt.hash('password', 10);
    user.email = 'ride@gmail.com';
    user.name = 'Juan David';

    await queryRunner.manager.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(User);
  }
}
