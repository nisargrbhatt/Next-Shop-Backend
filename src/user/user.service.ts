import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants/constants';
import { createUserData } from './dto/param.interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly UserRepository: typeof User,
  ) {}

  async create(createUserData: createUserData | any): Promise<User> {
    return await this.UserRepository.create<User>(createUserData);
  }

  async update(updateUserData: any, id: string): Promise<[number, User[]]> {
    return await this.UserRepository.update<User>(updateUserData, {
      where: {
        id,
      },
    });
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

  async findOneByEmailRole(email: string, role: string): Promise<User> {
    return await this.UserRepository.findOne<User>({
      where: {
        email,
        role,
      },
    });
  }
}
