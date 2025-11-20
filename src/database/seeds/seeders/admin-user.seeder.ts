import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AdminSeederService } from '../seed.service';

async function bootstrap() {
  const logger = new Logger('SeedAdminScript');
  logger.log('Starting admin seeder script...');

  // Create a standalone application context
  const appContext = await NestFactory.createApplicationContext(AppModule);

  // Retrieve the Seeder service from the application context
  const adminSeeder = appContext.get(AdminSeederService);

  try {
    await adminSeeder.seedAdminUser();
    logger.log('Admin seeding completed successfully.');
  } catch (error) {
    logger.error('Admin seeding failed:', error);
    process.exit(1); // Exit with error code if something goes wrong
  } finally {
    await appContext.close(); // Close the application context cleanly
    process.exit(0); // Exit successfully
  }
}

bootstrap().catch(err => {
  console.error('Script bootstrap error:', err);
  process.exit(1);
});


