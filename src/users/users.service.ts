import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Point } from 'src/points/entities/point.entity';
import { Role } from './types/userRole.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,

    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async signUp(email: string, password: string, name: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });

    await this.pointRepository.save({
      userId: user.id,
    });
  }
  async signUpAdmin(email: string, password: string, name: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      role: Role.Admin,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async getPoint(userId: number) {
    return await this.pointRepository
      .createQueryBuilder('point')
      .select('SUM(point.point)', 'Point')
      .where('point.userId = :userId', { userId })
      .getRawOne();
  }
}
