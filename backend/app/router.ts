import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post('/signup', controller.user.signup);
  router.post('/login', controller.user.login);
};
