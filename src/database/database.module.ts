import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: configService.getOrThrow('POSTGRES_DB_HOST'),
          port: parseInt(configService.getOrThrow('POSTGRES_DB_PORT'), 10),
          database: configService.getOrThrow('POSTGRES_DB_DATABASE'),
          username: configService.getOrThrow('POSTGRES_DB_USERNAME'),
          password: configService.getOrThrow('POSTGRES_DB_PASSWORD'),

          autoLoadEntities: true,

          synchronize: !isProd,

          logging: !isProd,
          ssl: {
            rejectUnauthorized: false, // Required for Render and prevents SSL issues
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}
  private readonly logger = new Logger(DatabaseModule.name);
  
  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('Database connection successful!');
    } catch (error) {
      this.logger.error('Database connection failed!', error);
    }
  }
}
