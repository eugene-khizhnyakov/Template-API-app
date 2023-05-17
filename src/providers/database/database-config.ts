import { config } from 'dotenv';
import { ConfigurationService } from '../../modules/configurations/configuration.service';

config();

const configurationService = new ConfigurationService();

export default {
  type: 'postgres',
  entities: ['dist/src/modules/models/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/providers/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/providers/database/migrations',
  },
  migrationsRun: true,
  synchronize: false,
  logging: true,
  ...configurationService.getDBConfiguration(),
};
