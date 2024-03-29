/**
 * @file 全局配置
 * @author Surmon <https://github.com/surmon-china>
 */

export const APP_TITLE = 'Surmon.me';
export const BLOG_HOST = '//surmon.me';
export const BLOG_SITE = `https:${BLOG_HOST}`;
export const STATIC_URL = 'https://static.surmon.me';
export const GRAVATAR_API = `${STATIC_URL}/avatar`;
export const ALIYUN_OSS_REGION = 'oss-cn-hangzhou';
export const ALIYUN_OSS_BUCKET = 'surmon-static';

export const DEVELOP_API = {
  // API_ROOT: '/api',
  API_ROOT: 'http://127.0.0.1:4523/mock/613874',
  STATIC_URL,
};

export const PRODUCTION_API = {
  API_ROOT: 'http://127.0.0.1:4523/mock/613874',
  STATIC_URL
};
