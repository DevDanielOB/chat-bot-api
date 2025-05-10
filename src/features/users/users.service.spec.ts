import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email is already in use', async () => {
      const userDto: UserDto = { nome: 'Test User', email: 'test@example.com', senha: 'password123' };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({ email: 'test@example.com' } as User);

      await expect(service.create(userDto)).rejects.toThrow(ConflictException);
    });

    it('should hash the password and save the user', async () => {
      const userDto: UserDto = { nome: 'Test User', email: 'test@example.com', senha: 'password123' };
      const hashedPassword = 'hashedPassword123';
      const savedUser = { id: 1, email: 'test@example.com', senha: hashedPassword } as User;

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword as never);
      jest.spyOn(userRepo, 'create').mockReturnValueOnce(savedUser);
      jest.spyOn(userRepo, 'save').mockResolvedValueOnce(savedUser);

      const result = await service.create(userDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(userDto.senha, 10);
      expect(userRepo.create).toHaveBeenCalledWith({ ...userDto, senha: hashedPassword });
      expect(userRepo.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });
  });
});