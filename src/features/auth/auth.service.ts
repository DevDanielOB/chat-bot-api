import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/models/user.entity';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email: loginDto.email } });

    if (!user || !(await bcrypt.compare(loginDto.senha, user.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { senha, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}