'use strict';

module.exports = {
  
  /* http status errorCode */

  'OK': {
    code: 200,
    message: '操作成功！'
  },
  'Created': {
    code: 201,
    message: '创建成功！'
  },
  
  'BadRequest': {
    errorCode: 400,
    error: '错误的请求'
  },
  'Unauthorized': {
    errorCode: 401,
    error: '您尚未登录'
  },
  'Forbidden': {
    errorCode: 403,
    error: '您没有权限浏览或编辑该内容'
  },
  'NotFound': {
    errorCode: 404,
    error: '页面建设中...'
  },
  'InternalServerError': {
    errorCode: 500,
    error: '服务器错误，请联系管理员'
  },
  'NotImplemented': {
    errorCode: 501,
    error: '功能尚未完成...'
  },

  /* user error errorCode */
  'UserNotFound': {
    errorCode: 400020,
    error: '找不到该用户'
  },
  'LoginFailed': {
    errorCode: 400021,
    error: '登录失败，请检查您的用户名密码',
  },
  'PasswordError': {
    errorCode: 400022,
    error: '原密码错误',
  },
  'UserIsBanned': {
    errorCode: 400023,
    error: '该账户已被停用',
  },
  'UserConflicted': {
    errorCode: 400024,
    error: '用户名或邮箱已被注册'
  },
  'SmsCodeError': {
    errorCode: 400025,
    error: '验证码不正确'
  },
  'SmsCodeExpired': {
    errorCode: 400026,
    error: '验证码已过期'
  },
  'EmailConflicted': {
    errorCode: 400027,
    error: '邮箱已被使用'
  },

  /* general error */
  'ObjectNotFound': {
    errorCode: 400090,
    error: '找不到该对象'
  }

}