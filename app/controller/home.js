'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const { ym, ymdhms } = require('../../config/constants');


class HomeController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ArticleService = ctx.service.articleService;
  }
  async archives() {
    const ctx = this.ctx;
    const { data } = await this.ArticleService.getAllList(ctx.request.body);
    const result = {};
    data.forEach(item => {
      const key = moment(item.updated_at).format(ym);
      if (!result[key]) {
        result[key] = [];
      }
      item.updated_at = moment(item.updated_at).format(ymdhms);
      result[key].push(item);
    });
    await this.ctx.render('archives.ejs', {
      data: result,
    });
  }
  async index() {
    const ctx = this.ctx;
    const { data } = await this.ArticleService.getList(ctx.request.body);
    data.list.map(item => {
      item.updated_at = moment(item.updated_at).format(ymdhms);
      return item;
    });
    await this.ctx.render('index.ejs', {
      data,
    });
  }

  async detail() {
    const ctx = this.ctx;
    const { data } = await this.ArticleService.getDetail(ctx.params.id);
    await this.ctx.render('detail.ejs', {
      data: data.data,
    });
  }
}

module.exports = HomeController;
