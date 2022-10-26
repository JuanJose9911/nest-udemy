import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Pokemon, PokemonSchema} from "./entities/pokemon.entity";
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
      ConfigModule,
      MongooseModule.forFeature([
        {
          name: Pokemon.name,
          schema: PokemonSchema,
        }
      ])  //Se utiliza para traer la configuracion de otro lugar y que la aplicacion no se levante hasta que se resuelvan los requerimientos
  ],
    exports: [MongooseModule]
})
export class PokemonModule {}
