;(function($, window, document, undefined){
    'use strict';

    $(document).ready(function(){
        $('.js-btn-exchange').on('click', function(){
            var btn = $(this);
            BootstrapDialog.confirm({
                type: BootstrapDialog.TYPE_DEFAULT,
                size: BootstrapDialog.SIZE_SMALL,
                title: '系统提示',
                message: '请确认是否执行此操作？',
                btnCancelLabel: '取消',
                btnOKLabel: '确定',
                btnOKClass: 'btn-primary',
                closable: true,
                callback: function(type){
                    if(type){
                        btn.prop('disabled', true);
                        $.ajax({
                            type: 'GET',
                            dataType: 'json',
                            url: '/manage/goods/sync_goods',
                        }).done(function(res){
                            if(parseInt(res.code) === 0){
                                window.location.reload(true);
                            } else {
                                BootstrapDialog.alert({
                                    type: BootstrapDialog.TYPE_DEFAULT,
                                    size: BootstrapDialog.SIZE_SMALL,
                                    title: '系统提示',
                                    message: res.msg,
                                    buttonLabel: '我知道了',
                                    closable: true
                                });
                            }

                        }).fail(function(){
                            BootstrapDialog.alert({
                                type: BootstrapDialog.TYPE_DEFAULT,
                                size: BootstrapDialog.SIZE_SMALL,
                                title: '系统提示',
                                message: '交互失败稍候再试',
                                buttonLabel: '我知道了',
                                closable: true
                            });
                        }).always(function(){
                            btn.prop('disabled', false);
                        });
                    }
                }
            });
            return false;
        });
    });

})(jQuery, window, document);
