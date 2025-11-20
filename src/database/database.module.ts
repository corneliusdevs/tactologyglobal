import { Module, OnModuleInit } from '@nestjs/common';
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

          ssl: isProd // Postgres requires SSL in production
            ? { rejectUnauthorized: false }
            : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})

export class DatabaseModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('Database connection successful!');
    } catch (error) {
      console.error('Database connection failed!', error);
    }
  }
}
