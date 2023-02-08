// This file is created by egg-ts-helper@1.34.5
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportLog from '../../../app/middleware/log';

declare module 'egg' {
  interface IMiddleware {
    log: typeof ExportLog;
  }
}
