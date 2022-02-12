$(function(){
    // 获取layui里的form
    var form = layui.form;
    // 1、自定义一些校验规则
    form.verify({
       pwd:[/[\S]{6,12}/,'密码必须是6-12位，且不能出现空格'],
       newPwd: function(value){
           if(value === $('[name=oldPwd]').val()){
               return '新旧密码不能相同'
           }
       },
       rePwd: function(value){
           if(value !== $('[name=newPwd]').val()){
               return '两次密码不一致！'
           }
       } 
    })

    // 2、监听表单提交事件
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            method:'post',
            data: $(this).serialize(),
            success:function(res){
                console.log(res)
                if(res.status !== 0){
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('修改密码成功！')
                // 3、修改密码成功后，重置表单
                // 把jquery对象转换成原生js对象，从而调用原生自带的方法
                $('.layui-form')[0].reset();
            }
        })
    })
})