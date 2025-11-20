import depthLimit from 'graphql-depth-limit';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule, // UsersModule should export UsersResolver 
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';
        return {
          autoSchemaFile: join(process.cwd(), 'dist/schema.gql'),
          sortSchema: true,
          playground:
            !isProd && configService.get('ENABLE_GRAPHQL_PLAYGROUND', false),
          introspection: !isProd,
          context: ({ req }) => {
            const token = req.headers.authorization?.replace('Bearer ', '');
            return { req, token }; // keep req for guards, token for manual use
          },
          validationRules: [
            depthLimit(10), // limit query depth to 10
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class GraphqlSetupModule {
  private readonly logger = new Logger(GraphqlSetupModule.name);

  constructor() {
    this.logger.log('GraphQL Setup Module initialized');
  }
}
