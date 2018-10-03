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
    await this.ctx.render('index.ejs', {
      data,
    });
  }
  async detail() {
    const ctx = this.ctx;
    const { data } = await this.ArticleService.getList(ctx.request.body);
    await this.ctx.render('detail.ejs', {
      data,
    });
  }
}

module.exports = HomeController;
