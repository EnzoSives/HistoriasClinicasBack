// import { IsEnum } from "class-validator";
// import { Role } from "src/common/enum/rol.enum";
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from "typeorm"

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column()
    password:string;

    @Column()
    email: string;

    // @IsEnum(Role) // Assuming Rol is an Enum
    // role: Role;

    @DeleteDateColumn()
    deleteAt: Date;

    constructor(username:string, password:string, email:string){
        this.username = username;
        this.password = password;
        this.email = email;
    }
}