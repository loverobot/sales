;(function($, window, document, undefined){
    'use strict';

    var page = {
        checkall: function(){
            var btn = $('.btn-checkall');
            var text = $.trim(btn.text());
            var items = $('input[name="check_input"]');
            if(text === '全选'){
                btn.html('<i class="fa fa-check" aria-hidden="true"></i> 不选');
                items.prop('checked', true);
            } else {
                btn.html('<i class="fa fa-check" aria-hidden="true"></i> 全选'); 
                items.prop('checked', false);
            }
        },
        approve: function(){ 
            var postData = [];
            $.each($('input[name="check_input"]:checked'), function(){
                postData.push($(this).val());    
            });
            if(postData.length > 0){ 
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
                            $.ajax({
                                type: 'GET',
                                dataType: 'json',
                                url: '/manage/order/checkstatus',
                                data: { checkbox: postData.join(',') },
                                success: function(res){
                                    if(parseInt(res.code) === 0){
                                        window.location.reload();
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
                                },
                                error: function(){
                                    BootstrapDialog.alert({
                                        type: BootstrapDialog.TYPE_DEFAULT,
                                        size: BootstrapDialog.SIZE_SMALL,
                                        title: '系统提示',
                                        message: '交互出现错误，请稍候重试！',
                                        buttonLabel: '我知道了',
                                        closable: true
                                    });   
                                }
                            });
                        }    
                    }
                });  
            }
        },
        init: function(){
            var self = page;
            $('.btn-checkall').on('click', function(){
                self.checkall();    
            });
            $('.btn-approve').on('click', function(){
                self.approve();    
            });
        }
    };

    $(document).ready(page.init);
})(jQuery, window, document);
