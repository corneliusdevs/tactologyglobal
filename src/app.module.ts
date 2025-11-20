import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { GraphqlSetupModule } from './graphql-setup/grapghql-setup.module';
import { LoggingMiddleware } from './utils/logging/logging.middleware';
import { AppService } from './app.service';
import { SeederModule } from './database/seeds/seed.module';
import { AuthModule } from './auth/auth.module';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { GqlAuthGuard } from './common/guards/gql-auth.guard';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting (Throttler)
    ThrottlerModule.forRoot([{
      ttl: 60, // 1 minute window
      limit: 50, // max 50 requests per window, just for testing purposes, value can be lower in standard production setup.
    }]),

    // Infrastructure
    DatabaseModule,
    GraphqlSetupModule,

    // Feature modules
    SeederModule,
    AuthModule,
  ],
  controllers: [
    AppController
],
  providers: [
    AppService,
      {
    provide: APP_GUARD,
    useClass: GqlAuthGuard, // global auth guard
  },
    // Enforce global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);

  configure(consumer: MiddlewareConsumer) {
    // Only apply logging middleware in non-production
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log('Applying LoggingMiddleware globally');
      consumer.apply(LoggingMiddleware).forRoutes('*');
    }
  }
}
