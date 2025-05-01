import { Module } from '@nestjs/common';
import { ModulesModule } from './modules';
import { ServiceModule } from './services';
import { MiddlewareModule } from './middlewares';
import { InfrastructureModule } from './infrastructures';

@Module({
  imports: [
    InfrastructureModule,
    MiddlewareModule,
    ServiceModule,
    ModulesModule,
  ],
})
export class AppModule {}
