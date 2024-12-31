import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './environment/environment';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './models/users/users.module';
import { StoresModule } from './models/stores/stores.module';
import { CategoriesModule } from './models/categories/categories.module';
import { ProductsModule } from './models/products/products.module';
import { SalesModule } from './models/sales/sales.module';
import { AuthModule } from './models/auth/auth.module';
import { RolesModule } from './models/roles/roles.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { WebSocketGatewayModule } from './websocket/websocket.module';
import { SocketGateway } from './websocket/websocket.gateway';
import { SheetsModule } from './models/sheets/sheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${environment.databaseUrl}`),
    UsersModule,
    StoresModule,
    CategoriesModule,
    ProductsModule,
    SalesModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    SheetsModule,
    WebSocketGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
