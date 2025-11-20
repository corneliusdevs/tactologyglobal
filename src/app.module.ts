import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { GraphqlSetupModule } from './graphql-setup/grapghql-setup.module';

// import { UsersModule } from './users/users.module';
// import { ProductsModule } from './products/products.module';
// import { CategoryModule } from './category/category.module';
// import { SuppliersModule } from './suppliers/suppliers.module';
// import { ImageModule } from './images/images.module';
// import { OrderModule } from './order/order.module';

import { LoggingMiddleware } from './utils/logging/logging.middleware';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';

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
    // UsersModule,
    // ProductsModule,
    // CategoryModule,
    // SuppliersModule,
    // ImageModule,
    // OrderModule,
  ],
  controllers: [
    // AppController
],
  providers: [
    // AppService,
  //     {
  //   provide: APP_GUARD,
  //   useClass: JwtAuthGuard, // global auth guard
  // },
    // Enforce global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Optional: Global JWT auth guard (can be overridden per resolver)
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
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
