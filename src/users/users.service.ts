import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    create(createUserDto: CreateUserDto) {
        return this.userRepository.save(createUserDto);
    }
    findAll() {
        return this.userRepository.find();
    }

    findOneById(id: number) {
        return this.userRepository.findOneBy({ id });
    }

    findOneByEmail(email: string) {
        return this.userRepository.findOneBy({ email });
    }
    findOneByUser(username: string) {
        return this.userRepository.findOneBy({ username });
    }

    findByEmailWithPassword(email: string) {
        return this.userRepository.findOne({
            where: { email },
            select: ['id', 'username', 'email', 'password'],
        })
    }
}