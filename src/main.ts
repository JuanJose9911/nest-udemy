import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v2');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Remueve la data que no estoy esperando
        forbidNonWhitelisted: true, // Si hay data que no estoy esperando, lanza un error
        transform: true, // Transforma la data que viene en el request
        transformOptions: {
            enableImplicitConversion: true, // Convierte los tipos de datos
        }
    }));
    await app.listen(process.env.PORT );
}

bootstrap();
