import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './question/question.module';
import { SentenceModule } from './sentence/sentence.module';
import { AuthModule } from './auth/auth.module';
import { ResponseModule } from './response/response.module';
import { ExamsModule } from './exams/exams.module';
import { RetestsModule } from './retests/retests.module';
import { PlanModule } from './plan/plan.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    QuestionModule,
    // TypeOrmModule.forRoot(typeOrmConfig), // not using config file but env variables
    // NEED TO USE FORROOTASYNC BECAUSE WE NEED THE CONFIG MODULE TO BE LOADED BEFORE
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    SentenceModule,
    AuthModule,
    ResponseModule,
    ExamsModule,
    RetestsModule,
    PlanModule,
  ],
})
export class AppModule {}
