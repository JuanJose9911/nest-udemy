import { Injectable } from '@nestjs/common';
import {PokeResponse} from "./interfaces/poke-response.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Pokemon} from "../pokemon/entities/pokemon.entity";
import {Model} from "mongoose";
import axios, {AxiosInstance} from "axios";
import {HttpAdapter} from "../common/interfaces/http-adapter.interface";

@Injectable()
export class SeedService {

  constructor(
      @InjectModel( Pokemon.name )
      private readonly pokemonModel: Model<Pokemon>,

      private readonly httpAdapter: HttpAdapter
  ) {}




  async executeSeed() {

    this.pokemonModel.deleteMany({});

    const data = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    // Insertar las promesas en un arreglo de promesas y luego resolverlas todas con la funcion Promise.all
    // const promises = [];
    // data.results.forEach( async ({name, url}) => {
    //   const segments = url.split('/');
    //   const no:number = +segments[segments.length - 2];
    //   // const pokemon = await this.pokemonModel.create({name, no});
    //     promises.push( this.pokemonModel.create({name, no}) );
    // });
    //
    // await Promise.all(promises);


    // Otra forma de hacerlo
    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach( ({name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];

      pokemonToInsert.push({name, no});
    });

    this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }
}

