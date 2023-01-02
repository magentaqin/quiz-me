// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAnswer from '../../../app/controller/answer';
import ExportQuestion from '../../../app/controller/question';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    answer: ExportAnswer;
    question: ExportQuestion;
    user: ExportUser;
  }
}
