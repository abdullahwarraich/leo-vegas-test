import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('users');
  }
}
