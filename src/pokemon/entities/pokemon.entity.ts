//Las entidades hacen referencia a como queremos guardar los datos en la base de datos
//Las entidades usualmente hacen una relacion con las tablas de las bases de datos
//Una instancia de la clase PokemonEntity es un registro de la tabla pokemon
import {Document} from "mongoose"; //Extiende los metodos y se encarga de automatizar los id y otras cosas
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema() //Decorador que le dice a Nest que esta clase es una entidad
export class Pokemon extends Document {

    // id: string Mongoose lo crea automaticamente
    @Prop({
        unique: true,
        index: true
    }) //Decorador que le dice a Nest que este atributo es un campo de la tabla y declara los constrain
    name: string ;
    @Prop({
        unique: true,
        index: true
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);