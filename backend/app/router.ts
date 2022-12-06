import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const userAuthMiddleware = app.middleware.userAuth()
  /** User */
  router.post('/signup', controller.user.signup);
  router.post('/login', controller.user.login);

  /** Question */
  router.post('/question/add', userAuthMiddleware, controller.question.addQuestion)
};
