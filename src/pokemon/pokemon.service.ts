import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {isValidObjectId, Model} from "mongoose";
import {Pokemon} from "./entities/pokemon.entity";

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import {InjectModel} from "@nestjs/mongoose";
import {retry} from "rxjs";

@Injectable()
export class PokemonService {

  constructor(
      @InjectModel( Pokemon.name )
      private readonly pokemonModel: Model<Pokemon>
  ) {}

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

  findAll() {
    return `This action returns all pokemon`;
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