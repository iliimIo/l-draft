import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  process.env.TZ = 'UTC'
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  })

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('LOTTO')
    .setDescription('The LOTTO API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('document', app, document)

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: true,
    // origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  })
  app.setGlobalPrefix('api/v1')
  await app.listen(8002)
}
bootstrap()
