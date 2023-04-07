// This file is created by egg-ts-helper@1.34.5
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportAnswer from '../../../app/controller/answer';
import ExportQuestion from '../../../app/controller/question';
import ExportTag from '../../../app/controller/tag';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    answer: ExportAnswer;
    question: ExportQuestion;
    tag: ExportTag;
    user: ExportUser;
  }
}
