import { MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from './core/constants/constants';

export const AppProviders = [
  {
    provide: APP_INTERCEPTOR,
    useClass: MorganInterceptor(
      `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[header]`,
    ),
  },
];
