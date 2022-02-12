$(function(){
    // 获取layui中的form表单
    var form = layui.form;
    // 1、创建自定义的表单验证
    form.verify({
        nickname:function (value, item) { 
            if(value.length > 6){
                return '昵称长度必须在1-6个字符之间';
            }
         }
    })
    // 2、调用初始化用户信息函数
    initUserInfo()
    // 3、监听表单提交事件,实现重置表单数据
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method:'post',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    layui.layer.msg('修改用户信息失败!')
                }
                layui.layer.msg('修改用户信息成功!')
                // 调用父页面index.js中的 getUserInfo()方法，从新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
                // window代表iframe标签所在区域，即user_info.html所显示的区域
            }
        })
    })
    $('#btnReset').on('click',function(e){
        // 阻止表单默认行为
        e.preventDefault();
        // 再次初始化表单数据
        initUserInfo()
    })
    // 4、给提交修改按钮绑定表单提交事件，实现提表单改功能



    // 定义初始化用户信息函数
    function initUserInfo(){
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function(res){
                if(res.status !== 0){
                    layui.layer.msg('获取用户信息失败')
                }
                // 调用form.val()快速给表单赋值
                // 第一个参数是，给那个表单赋值，第二个参数是要赋值的数据对象
                form.val('formUserInfo', res.data)
            }
        })
    }
})