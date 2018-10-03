'use strict';

const Service = require('egg').Service;
const services = require('../../config/server').dev;

class ArticleService extends Service {
  /**
   * @param {Object} 'user数据'
   * @return {Object} data
   */
  async getList() {
    // const data = await this.ctx.curl(`${services.admin}/blog/article/list`, {
    //   dataType: 'json',
    // });
    const data = await this.ctx.curl(`${services.admin}/blog/article/list`, {
      // 自动解析 JSON response
      dataType: 'json',
      // 3 秒超时
      timeout: 3000,
    });
    return data;
  }
  /**
   * @param {Number} id 'id数据'
   * @return {Object} data
   */
  async getDetail(id) {
    const data = await this.ctx.curl(`${services.admin}/blog/article/detail`, {
      // 自动解析 JSON response
      type: 'post',
      dataType: 'json',
      // 3 秒超时
      timeout: 3000,
      data: {
        id,
      },
    });
    return data;
  }

}

module.exports = ArticleService;
