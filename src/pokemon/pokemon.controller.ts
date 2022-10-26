import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import {PaginationDto} from "../common/dto/pagination.dto";

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(200) // Cambiar el codigo de respuesta
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll( paginationDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.pokemonService.findOne( termino );
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove( id );
  }
}
