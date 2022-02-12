$(function(){
      // 1.1 获取裁剪区域的 DOM 元素
      var $image = $('#image')
      // 1.2 配置选项
      const options = {
          // 纵横比
          aspectRatio: 1,
          // 指定预览区域
          preview: '.img-preview'
      }

      // 1.3 创建裁剪区域
      $image.cropper(options)

    // 给上传按钮绑定点击事件
    $('#btnChooseImg').on('click', function(){
        $('#file').click();
    })

    // 为文件事件框绑定change事件
    $('#file').on('change', function(e){
        // 拿到用户选择文件
        var fileList = e.target.files;
        if(fileList.length === 0){
            return layui.layer.msg('请选择文件！')
        }
        // 1、拿到用户选择的第一个文件,通过e.target.files可以拿到用户选择的文件，files是一个伪数组
        var file = e.target.files[0];
        // 2、根据选择的文件，创建一个对应的url地址
        var newImgUrl = URL.createObjectURL(file);
        console.log(newImgUrl)
        // 3、先销毁旧的裁剪区域，再重新设置图片路径，再重新创建裁剪区域
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options)
    })

    // 为确认按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 1、拿到用户裁剪之后的图片
        // 将裁剪后的图片，转换为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2、发起请求，把图片上传到服务器
        $.ajax({
            url: '/my/update/avatar',
            method:'post',
            data: {
                avatar: dataURL
            },
            success: function(res){
                if (res.status !== 0) {
                    return layui.layer.msg('头像更换失败！')
                }
                layui.layer.msg('头像更换成功！')
                // 调用父级的方法，更换主页的头像
                // 在iframe中显示的页面中想要调用父页面的方法，要用window.parent
                window.parent.getUserInfo()
            }
        })
    })
})