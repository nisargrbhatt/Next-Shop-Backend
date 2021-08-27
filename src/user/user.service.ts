import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants/constants';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly UserRepository: typeof User,
  ) {}

  async create(createUserData): Promise<User> {
    return await this.UserRepository.create<User>(createUserData);
  }

  async findAll(): Promise<User[]> {
    return await this.UserRepository.findAll<User>({});
  }

  async findOneByPk(id: string): Promise<User> {
    return await this.UserRepository.findByPk<User>(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.UserRepository.findOne<User>({ where: { email } });
  }
}
