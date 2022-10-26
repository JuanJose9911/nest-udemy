import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {isValidObjectId, Model} from "mongoose";
import {Pokemon} from "./entities/pokemon.entity";

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import {InjectModel} from "@nestjs/mongoose";
import {retry} from "rxjs";
import {PaginationDto} from "../common/dto/pagination.dto";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PokemonService {

  private defaulLimit: number;

  constructor(
      @InjectModel( Pokemon.name )
      private readonly pokemonModel: Model<Pokemon>,

      private readonly configService: ConfigService
  ) {
    this.defaulLimit = this.configService.getOrThrow<number>('DEFAULT_LIMIT');
    console.log( configService.getOrThrow<number>('SEXO') ); //busca en las variables de entorno si no lo encuentra arroja un error
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    // Siempre tratar de hacer la menor cantidad de consultas a la base de datos
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return 'This action adds a new pokemon';
    }catch (e) {
      this.handleException(e);
    }
  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = this.defaulLimit, offset = 0   } = paginationDto;

    // Devuelve un arreglo de porkemons paginado, con un limite de 10 y un offset de 0 por defecto, los ordena por numerp de pokemon
    return this.pokemonModel.find()
        .limit( limit )
        .skip( offset ).
        sort( { no: 1 } )
        .select('-__v');
  }

  async findOne(termino: string) {
    let pokemon: Pokemon;

    if ( !isNaN( +termino )){
      pokemon = await this.pokemonModel.findOne( { no: termino })
    }

    //Mongo id
    if ( !pokemon && isValidObjectId( termino  )){
      pokemon = await this.pokemonModel.findById( termino );
    }
    //Name
    if ( !pokemon ){
      pokemon = await this.pokemonModel.findOne( { name: termino.toLowerCase().trim() } );
    }
    if ( !pokemon ) throw new NotFoundException(`Pokemon not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne( term ); //en la constante se guarda el objeto del modelo

      if ( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne( updatePokemonDto, { new: true} );

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    }catch (e){
      this.handleException(e);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();

    // return this.pokemonModel.findByIdAndDelete( id );

    const { deletedCount } = await this.pokemonModel.deleteOne( { _id: id } );
    if ( deletedCount === 0 ) throw new NotFoundException(`Pokemon not found`);

    return;
  }

  private handleException(e: any) {
    if (e.code === 11000){
      throw new BadRequestException(`Pokemon already exists in db ${ JSON.stringify( e.keyValue ) }`);
    }
    throw new InternalServerErrorException(`Can't create pokemon - check server logs`);
  }
}