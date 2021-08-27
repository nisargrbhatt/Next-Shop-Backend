import { MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from './core/constants/constants';

export const AppProviders = [
  {
    provide: APP_INTERCEPTOR,
    useClass: MorganInterceptor(`combined`),
  },
];
