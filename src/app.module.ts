import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { PusherModule } from './pusher/pusher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.URI_MONGO'),
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    PusherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
