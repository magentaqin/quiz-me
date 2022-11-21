// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUserAuth from '../../../app/middleware/userAuth';

declare module 'egg' {
  interface IMiddleware {
    userAuth: typeof ExportUserAuth;
  }
}
