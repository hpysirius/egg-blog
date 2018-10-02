'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ArticleService = ctx.service.articleService;
  }
  async index() {
    const ctx = this.ctx;
    const { data } = await this.ArticleService.getList(ctx.request.body);
    console.log(data.data.list[0]);
    await this.ctx.render('index.ejs', {
      data,
    });
  }
}

module.exports = HomeController;
