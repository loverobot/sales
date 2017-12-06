;(function($, window, document, undefined){
    'use strict';

    $(document).ready(function(){

        var uploader = WebUploader.create({
            server: '/manage/file/import',
            pick: {
                id: '#picker',
                multiple: false
            },
            resize: false,
            auto: true
        });

        uploader.on('uploadSuccess', function(){
            BootstrapDialog.alert({
                type: BootstrapDialog.TYPE_DEFAULT,
                size: BootstrapDialog.SIZE_SMALL,
                title: '系统提示',
                message: '文件导入成功，请订单列表查看结果。',
                buttonLabel: '我知道了',
                closable: true
            });
        });

        uploader.on('uploadError', function(){
            BootstrapDialog.alert({
                type: BootstrapDialog.TYPE_DEFAULT,
                size: BootstrapDialog.SIZE_SMALL,
                title: '系统提示',
                message: '文件导入失败，请联系工程师或稍后重试！',
                buttonLabel: '我知道了',
                closable: true
            });
        });
    });

})(jQuery, window, document);
