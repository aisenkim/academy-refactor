import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential-dto';
import { Role } from './role.enum';
import { UserError } from './user-error.enum';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';

describe('AuthService', () => {
  let service: AuthService;
  let repository;
  let jwtService: JwtService;

  const mockUserRepository = () => ({
    createUser: jest.fn(),
    findOne: jest.fn(),
  });

  const credentials: AuthCredentialDto = {
    username: 'test',
    password: 'test',
    role: Role.USER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUserRepository },
      ],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'topSecret15',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });
  describe('Check if everything is defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });
  });

  describe('signUp', () => {
    it('should signup a user', async () => {
      repository.createUser.mockResolvedValue(undefined);
      const result = await service.signUp(credentials);
      expect(result).toBe(undefined);
    });

    it('Throw duplicate user error when trying to signup a user by duplicate username', async () => {
      repository.createUser.mockResolvedValue(UserError.DUPLICATE_USER);
      try {
        await service.signUp(credentials);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toEqual(UserError.DUPLICATE_USER);
      }
    });

    it('should throw an internal server error', async () => {
      repository.createUser.mockResolvedValue(UserError.SERVER_ERROR);
      try {
        await service.signUp(credentials);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toEqual(UserError.SERVER_ERROR);
      }
    });
  });

  describe('signIn', () => {
    it('should sign in the user and return access token on success', async () => {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('test', salt);

      const user: User = new User();
      user.username = 'test';
      user.password = hashedPassword;

      repository.findOne.mockResolvedValue(user);
      const result: { accessToken: string } = await service.signIn(credentials);
      const payload: JwtPayload = { username: user.username };
      const accessToken: string = jwtService.sign(payload);
      expect(result.accessToken).toEqual(accessToken);
    });

    it('should throw unauthorized exception for wrong credentials', async () => {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('wrongPassword', salt);

      const user: User = new User();
      user.username = 'test';
      user.password = hashedPassword;

      repository.findOne.mockResolvedValue(user);
      try {
        await service.signIn(credentials);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('Please check your login credentials');
      }
    });
  });
});
