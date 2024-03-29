import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  /** User */
  router.post('/signup', controller.user.signup);
  router.post('/login', controller.user.login);
  router.get('/user/info', controller.user.getUserInfo);

  /** Question */
  router.post('/question/add', controller.question.addQuestion);
  router.post('/question/update', controller.question.updateQuestion);
  router.get('/tag/list', controller.question.listQuestionTag);
  router.get('/question/list', controller.question.listQuestion);
  router.get('/question/totalCount', controller.question.countQuestion);
  router.get('/question', controller.question.getQuestion);

  /**
   * Answer
   */
  router.post('/answer/add', controller.answer.addAnswer);
  router.post('/answer/update', controller.answer.updateAnswer);
  router.get('/answer', controller.answer.getAnswer);
  router.get('/answer/list', controller.answer.listAnswer);

  /**
   * Tag
   */
  router.post('/tag/add', controller.tag.addTag);
  router.post('/tag/batchSet', controller.tag.batchSetTags);
  router.post('/tag/delete', controller.tag.deleteTags);
  router.get('/tag/list', controller.tag.listTag);

  /**
   * Upload
   */
  router.post('/upload/image', controller.upload.uploadImage);
  router.post('/image/url', controller.upload.generateImageUrl);
};
