import {  IsInt, IsPositive} from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class SuplierAddress {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text')
    calle: string;

    @IsInt()
    @IsPositive()
    @Column('int')
    numero: number;



    @Column('text')
    ciudad: string;

    
    @Column('text')
    comuna: string;

}