$(function () {
    // 获取layui里的layer
    var layer = layui.layer;
    var form = layui.form;
    // 1、调用获取文章分类列表
    initArtCateList();

    // 2、给添加类别按钮绑定点击事件,显示弹出层
    var addDialog = null;
    $('#btnAddCate').on('click', function () {
        addDialog = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //3、通过代理的形式，给form-add表单绑定提交事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url: '/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    layer.msg('新增文章失败！')
                }
                // 调用获取文章分类列表方法，更新页面数据
                initArtCateList()
                layer.msg('新增文章成功！')
                // 关闭弹出层
                layer.close(addDialog);
            }
        })
    }) 

    // 4、给编辑按钮，绑定点击事件，注意该按钮也是动态拼接的，所以要用代理的形式添加点击事件
    var editDialog = null;
    $('tbody').on('click','.btn-edit', function(){
        // 4.1弹出一个文章分类修改的层
         editDialog = layer.open({
             type: 1,
             area: ['500px', '250px'],
             title: '修改文章分类',
             content: $('#dialog-edit').html()
         });
        
        //  4.2 发起请求，获取对应分类的数据
        // 获取编辑数据的id
        var id = $(this).attr('data-id')
        $.ajax({
            method:'GET',
            url: '/my/article/cates/'+id,
            success: function(res){
                form.val('form-edit', res.data)
            }

        })
    })

    // 5、通过代理的形式，为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层
                layer.close(editDialog);
                // 调用获取文章分类列表方法，更新页面数据
                initArtCateList();
            }
        })
    })

    // 通过代理的形式，给删除按钮绑定点击事件
    
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用书是否要删除
       layer.confirm('确定删除?', {
           icon: 3,
           title: '提示'
       }, function (index) {//这个函数就是，点击确认后执行的函数
        // 发起ajax请求，删除对应数据
        $.ajax({
            method:'GET',
            url: '/my/article/deletecate/'+id,
            success: function(res){
                if(res.status !== 0){
                    layer.msg('删除分类数据失败！')
                }
                layer.msg('删除分类数据成功!')
                // 关闭询问层
                layer.close(index);
                initArtCateList();
            }
        })
       });
    })
    // 定义获取文章分类列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                //拿到渲染后的字符串   
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
})