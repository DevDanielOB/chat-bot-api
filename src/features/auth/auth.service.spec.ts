import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/models/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepo: Repository<User>;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepo = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('validateUser', () => {
        it('should return user data without password if credentials are valid', async () => {
            const loginDto = { email: 'test@example.com', senha: 'password123' };
            const user = { id: 1, email: 'test@example.com', senha: 'hashedPassword' };

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never)

            const result = await authService.validateUser(loginDto);

            expect(result).toEqual({ id: 1, email: 'test@example.com' });
        });

        it('should throw UnauthorizedException if user is not found', async () => {
            const loginDto = { email: 'test@example.com', senha: 'password123' };

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

            await expect(authService.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const loginDto = { email: 'test@example.com', senha: 'password123' };
            const user = { id: 1, email: 'test@example.com', senha: 'hashedPassword' };

            jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);

            await expect(authService.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login', () => {
        it('should return an access token', async () => {
            const user = { id: 1, email: 'test@example.com' };
            const token = 'mockedAccessToken';

            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = await authService.login(user);

            expect(result).toEqual({ access_token: token });
        });
    });
});