;(function($, window, document, undefined){
    'use strict';

    $(document).ready(function(){
        $('.js-order-back').on('click', function(){
            var btn = $(this);
            var postData = {
                checkbox: $('input[name="order_num"]').val()
            };

            if(btn.hasClass('btn-approve')){
                postData.status = 3;
            } else {
                postData.status = 4;
                postData.reason = $('textarea[name="reason"]').val();
                if(!postData.reason){
                    BootstrapDialog.alert({
                        type: BootstrapDialog.TYPE_DEFAULT,
                        size: BootstrapDialog.SIZE_SMALL,
                        title: '系统提示',
                        message: '请先输入驳回理由！',
                        buttonLabel: '我知道了',
                        closable: true
                    });
                    return false;
                }
            }

            if(postData.checkbox){
                btn.prop('disabled', true);
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data: postData,
                    url: '/manage/order/checkstatus',
                }).done(function(res){
                    if(parseInt(res.code) === 0){
                        $('#mj-back-modal').modal('hide');
                        window.history.go(-1);
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
            return false;
        });
    });

})(jQuery, window, document);
