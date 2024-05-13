import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    // ClientsModule.register([
    //   //* configuracion con protocolo TCP
    //   // {
    //   //   name: PRODUCT_SERVICE,
    //   //   transport: Transport.TCP,
    //   //   options: {
    //   //     host: envs.productsMicroserviceHost,
    //   //     port: envs.productsMicroservicePort
    //   //   }

    //   // },
    //   //* configuracion con protocolo NATS
    //   {
    //     name: NATS_SERVICE,
    //     transport: Transport.NATS,
    //     options: {
    //       servers: envs.natsSrevers,
    //     }

    //   },
    // ]),
    NatsModule
  ]
})
export class ProductsModule {}
