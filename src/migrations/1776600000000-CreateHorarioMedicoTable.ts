import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHorarioMedicoTable1776600000000 implements MigrationInterface {
  name = 'CreateHorarioMedicoTable1776600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('horario_medico');
    if (!tableExists) {
      await queryRunner.query(`
        CREATE TABLE \`horario_medico\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`id_medico\` int NOT NULL,
          \`diaSemana\` int NOT NULL,
          \`horaInicio\` time NOT NULL,
          \`horaFin\` time NOT NULL,
          \`duracionMinutos\` int NOT NULL DEFAULT 30,
          \`maxTurnosPorDia\` int NOT NULL DEFAULT 10,
          PRIMARY KEY (\`id\`),
          CONSTRAINT \`FK_horario_medico_medico\` FOREIGN KEY (\`id_medico\`) REFERENCES \`medico\`(\`id_medico\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`horario_medico\``);
  }
}