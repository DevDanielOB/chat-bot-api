import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './models/user.entity';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(userDto: UserDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({ where: { email: userDto.email } });

    if (existingUser) {
      throw new ConflictException(`O email ${userDto.email} já está em uso`);
    }

    const hashedPassword = await bcrypt.hash(userDto.senha, 10);

    const newUser = this.userRepo.create({ ...userDto, senha: hashedPassword });
    return this.userRepo.save(newUser);
  }

  async getAllUsers(): Promise<Omit<User, 'senha'>[]> {
    const users = await this.userRepo.find();

    return users.map((user) => {
      const { senha, ...resultUser } = user;
      return resultUser;
    });
  }
}
