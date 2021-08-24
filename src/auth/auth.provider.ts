import { USER_REPOSITORY } from 'src/core/constants/constants';
import { User } from 'src/user/user.entity';

export const AuthProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
