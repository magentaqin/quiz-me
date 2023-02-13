import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  /** User */
  router.post('/signup', controller.user.signup);
  router.post('/login', controller.user.login);
  router.get('/user/info', controller.user.getUserInfo);

  /** Question */
  router.post('/question/add', controller.question.addQuestion);
  router.get('/tag/list', controller.question.listQuestionTag);
  router.get('/question/list', controller.question.listQuestion);
  router.get('/question/totalCount', controller.question.countQuestion);
  router.get('/question', controller.question.getQuestion);

  /**
   * Answer
   */
  router.post('/answer/add', controller.answer.addAnswer);
  router.get('/answer', controller.answer.getAnswer);
};
