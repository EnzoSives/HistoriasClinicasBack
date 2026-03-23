import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAntecedentesGinecoObstetricosToPaciente1774156800000 implements MigrationInterface {
  name = 'AddAntecedentesGinecoObstetricosToPaciente1774156800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('paciente');
    const columnExists = table?.findColumnByName('antecedentesGinecoObstetricos');
    if (!columnExists) {
      await queryRunner.query(
        'ALTER TABLE `paciente` ADD `antecedentesGinecoObstetricos` text NULL',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `paciente` DROP COLUMN `antecedentesGinecoObstetricos`',
    );
  }
}
