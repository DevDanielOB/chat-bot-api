import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
    let jwtAuthGuard: JwtAuthGuard;
    let jwtService: JwtService;

    beforeEach(() => {
        jwtService = new JwtService({});
        jwtAuthGuard = new JwtAuthGuard(jwtService);
    });

    describe('canActivate', () => {
        it('should return true if token is valid', () => {
            const mockContext = createMockExecutionContext('Bearer validToken');
            const mockRequest = mockContext.switchToHttp().getRequest();
            const decodedToken = { userId: 1 };

            jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

            const result = jwtAuthGuard.canActivate(mockContext);

            expect(result).toBe(true);
        });

        it('should throw UnauthorizedException if token is missing', () => {
            const mockContext = createMockExecutionContext();

            expect(() => jwtAuthGuard.canActivate(mockContext)).toThrow(
                new UnauthorizedException('Token não encontrado'),
            );
        });

        it('should throw UnauthorizedException if token is invalid', () => {
            const mockContext = createMockExecutionContext('Bearer invalidToken');

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                throw new Error('Token inválido');
            });

            expect(() => jwtAuthGuard.canActivate(mockContext)).toThrow(
                new UnauthorizedException('Token inválido'),
            );
        });
    });

    describe('extractTokenFromHeader', () => {
        it('should extract token from authorization header', () => {
            const mockRequest = {
                headers: {
                    authorization: 'Bearer validToken',
                },
            };

            const token = (jwtAuthGuard as any).extractTokenFromHeader(mockRequest);

            expect(token).toBe('validToken');
        });

        it('should return undefined if authorization header is missing', () => {
            const mockRequest = {
                headers: {},
            };

            const token = (jwtAuthGuard as any).extractTokenFromHeader(mockRequest);

            expect(token).toBeUndefined();
        });

        it('should return undefined if authorization header does not start with Bearer', () => {
            const mockRequest = {
                headers: {
                    authorization: 'InvalidHeader validToken',
                },
            };

            const token = (jwtAuthGuard as any).extractTokenFromHeader(mockRequest);

            expect(token).toBeUndefined();
        });
    });

    function createMockExecutionContext(authHeader?: string): ExecutionContext {
        return {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: authHeader,
                    },
                    user: null,
                }),
            }),
        } as unknown as ExecutionContext;
    }
});