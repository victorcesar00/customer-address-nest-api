import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //remove campos passados nao listados em dto
            forbidNonWhitelisted: true // dispara erro caso campo nao listado em dto seja passado
        })
    )
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
