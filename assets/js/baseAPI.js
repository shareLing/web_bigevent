// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 都会先调用$.ajaxPrefilter()这个函数，
// 在这个函数中，既可以拿到我们给Ajax提供的配置对象options，也可以在配置对象options上添加其他的配置属性
$.ajaxPrefilter(function (options) {
     // 在发起真正的ajax请求前，统一拼接请求的根路径
     options.url = 'http://www.liulongbin.top:3007' + options.url;
     // 统一为有权限的接口，设置headers请求头
     if (options.url.indexOf('/my/') !== -1) {
          options.headers = {
               Authorization: localStorage.getItem('token') || ''
          }
     }

     // 在options配置对象上添加complete属性，从而实现全局挂在complete回调函数
      options.complete = function (res) {
          //在 complete 回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
          if (res.responseJSON.status===1 && res.responseJSON.message === '身份认证失败！') {
               // 1、强制清空token
               localStorage.removeItem('token');
               // 2、强制跳转到登录页
               location.href = '/login.html'
          }
     }
})