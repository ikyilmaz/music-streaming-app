import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseOptions } from './configuration/mongoose.configuration';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // .env dosyasını yükleyelim
    ConfigModule.forRoot({ isGlobal: true }),

    // ODM'mizi yükleyelim
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseOptions,
      inject: [ConfigService],
    }),
    // Modüllerimizi ekleyelim
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
