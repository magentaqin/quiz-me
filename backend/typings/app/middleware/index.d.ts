// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLog from '../../../app/middleware/log';

declare module 'egg' {
  interface IMiddleware {
    log: typeof ExportLog;
  }
}
