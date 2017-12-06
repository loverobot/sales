;(function($, window, document, undefined){
    'use strict';
    
    var page = {
        form: $('#product-add-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    goods_name: {
                        required: true,
                        remote: {
                            url: '/manage/goods/checknameajax',
                            type: 'GET',
                            dataType: 'JSON',
                            data: {
                                goods_name: function(){
                                    return form.find('[name="goods_name"]').val();
                                },
                                goods_id: function(){
                                    return form.find('[name="goods_id"]').val();
                                }
                            },
                            dataFilter: function(respone){
                                var data = JSON.parse(respone);
                                var code = parseInt(data.code);
                                if(code === 0){
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    },
                    goods_code: {
                        required: true,
                        remote: {
                            url: '/manage/goods/checkcodeajax',
                            type: 'GET',
                            dataType: 'JSON',
                            data: {
                                goods_code: function(){
                                    return form.find('[name="goods_code"]').val();
                                },
                                goods_id: function(){
                                    return form.find('[name="goods_id"]').val();
                                }
                            },
                            dataFilter: function(respone){
                                var data = JSON.parse(respone);
                                var code = parseInt(data.code);
                                if(code === 0){
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                },
                messages: {
                    goods_name: {
                        required: '请输入产品名称',
                        remote: '产品名称已存在'
                    },
                    goods_code: {
                        required: '请输入产品条码',
                        remote: '产品条码已存在'
                    }
                },
                highlight: function(element){
                    var item = $(element).closest('.form-group');
                    item.addClass('has-error');
                },
                unhighlight: function(element){
                    var item = $(element).closest('.form-group');
                    item.removeClass('has-error');
                }
            });
        },
        init: function(){
            page.valid();
        }
    };
    
    $(document).ready(page.init);
    
})(jQuery, window, document);
