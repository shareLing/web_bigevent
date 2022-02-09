$(function () {
    // 点击去注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show()
    })
    // 点击去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show()
    })

    // 从layui中获取form表单
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数来自定义效验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 函数中的参数，就是再次确认密码框中的值
            // 拿到密码框的值
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#reg_form').on('submit', function (e) {
        // 阻止表单的默认的提交行为
        e.preventDefault();
        // 发起ajax的post的请求
        $.post('/api/reguser', {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            // 手动调用去登录链接的点击事件
            $('#link_login').click();
        })
    })

    // 监听登录表单的提交事件
    $('#login_form').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 获得token字符串
                // console.log(res.token)
                // 将登录成功的token字符串，保存在本地存储：localStorage
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})