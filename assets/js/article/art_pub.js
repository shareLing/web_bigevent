$(function () {
    var layer = layui.layer;
    var form = layui.form;
    /**
     * 1、获取文章分类列表
     */
    initCate();

    /**
     * 2、初始化富文本编辑器，该方式导入的layui的js文件自带的
     */
    initEditor()
    // 定义获取文章分类列表函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 通过代理的方式，渲染文章分类的下拉列表
                var htmlStr = template('tpl_cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 因为是用temple模板渲染的下拉菜单，layui没能识别到，
                // 所以一定要调用layui中的form.render()方法重新去渲染我们的表单区
                form.render();
            }
        })
    }
    /**
     * 3、实现基本裁剪效果：
     */
    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    /**
     * 4、为选择封面按钮绑定事件处理函数,模拟调用文件选择框的点击事件
     */
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click();
    })

    /**
     * 5、 监听文件选择框的change事件，更换裁剪的图片
     */
    $('#coverFile').on('change', function (e) {
        // 5.1 获取到文件列表数组
        var files = e.target.files;
        // 判断用户是否选择文件
        if (files.length === 0) {
            return layer.msg('还未选择封面！')
        }
        // 5.1 拿到用户选择的第一个文件
        var file = e.target.files[0];
        // 5.2 根据拿到的文件，创建一个文件的url
        var newImgUrl = URL.createObjectURL(file);
        // 5.3 销毁旧的裁剪区，再重新设置图片路径，最后再重新设置裁剪区域
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options)
    })


    /**
     * 6 、为存为草稿按钮绑定点击事件
     */
    // 定义文章发布状态，默认设置为已发布
    var art_state = '已发布';
    $('btn_save').on('click', function () {
        art_state = '草稿'
    })
    /**
     * 7、为表单绑定sumit事件
     */
    $('#form_pub').on('submit', function (e) {
        // 7.1 阻止表单默认行为
        e.preventDefault();
        // 7.2 快速创建一个FormData对象
        // 注意：$(this)后面加[0]是把jquery对象转化为JavaScript原生对象
        var fm = new FormData($(this)[0]);
        // 7.3 将文章的发布状态追加到fm对象中，即FormData对象中
        fm.append('state', art_state);
        /**
         * 8、 将裁剪后的图片， 输出为文件
         */
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象，参数blob就是图片的文件
            // 得到文件对象后，进行后续的操作
            // 8.1 将图片的文件对象追加到fm对象中
            fm.append('cover_img', blob)
            // 8.2 准备好要发送给服务器的数据fm后，发起ajax请求的方法
            publicArticle(fm);
        })
         // 可以通过循环检查是否打印出了表单中的数据
        //  fm.forEach(function(item,index){
        //      console.log(item,index)
        //  })
    })

    // 定义发表文章的方法
    function publicArticle(fm) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data:fm,
            // 注意：如果向服务器发送的是FormData格式的数据，
            // 必须在ajax请求中添以下两个配置项
            contentType:false,
            processData:false,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('发表文章失败！')
                }
                layer.msg('发布文章成功！');
                // 发布成功后跳转到文章列表页面
                location.href='/article/art_list.html'
            }
        })
    }

})