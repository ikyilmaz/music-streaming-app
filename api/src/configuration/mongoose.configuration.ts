import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseOptions = (
  configService: ConfigService,
): Promise<MongooseModuleOptions> | MongooseModuleOptions => {
  let uri = configService.get<string>('DATABASE_URL');

  uri = uri.replace(
    '<username>',
    configService.get<string>('DATABASE_USERNAME'),
  );
  uri = uri.replace(
    '<password>',
    configService.get<string>('DATABASE_PASSWORD'),
  );
  uri = uri.replace('<dbname>', configService.get<string>('DATABASE_NAME'));
 
  return {
    uri:
      process.env.NODE_ENV === 'production' ? uri : 'mongodb://localhost:27017',
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
};
