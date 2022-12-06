// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportQuestion from '../../../app/controller/question';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    question: ExportQuestion;
    user: ExportUser;
  }
}
