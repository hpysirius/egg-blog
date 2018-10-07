'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/archives', controller.home.archives);
  router.get('/links', controller.home.links);
  router.get('/tags', controller.home.tags);
  router.get('/about', controller.home.about);
  router.get('/article/detail/:id', controller.home.detail);
};
