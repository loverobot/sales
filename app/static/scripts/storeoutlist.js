;(function($, window, document, undefined){
    'use strict';

    var page = {
        dialog: $('#package-deliver-form'),
        fillForm: function(id){
            var form = page.dialog;
            form.find('input[name="store_out_id"]').val(id);
        },
        valid: function(){
            var form = page.dialog.find('form');
            form.validate({
                rules: {
                    store_out_express: {
                        required: true
                    },
                    store_out_express_number: {
                        required: true
                    }
                },
                messages: {
                    store_out_express: {
                        required: '请选择快递公司'
                    },
                    store_out_express_number: {
                        required: '请输入快递单号'
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
            var self = page;
            var form = self.dialog.find('form');
            self.valid();

            $('body').on('click', '.mj-deliver', function(){
                var id = $(this).data('id');
                if(id){
                    self.fillForm(id);
                    page.dialog.modal('show');
                }
            });

            //表单提交
            form.on('submit', function(){
                var valid = form.valid();
                var btn = form.find('[type="submit"]');
                var postData = {
                    store_out_id: '',
                    store_out_express_code: '',
                    store_out_express_company: '',
                    store_out_express_number: ''
                };
                var express = form.find('select[name="store_out_express"]');
                var id = form.find('input[name="store_out_id"]');
                var number = form.find('input[name="store_out_express_number"]');

                postData = {
                    store_out_id: id.val(),
                    store_out_express_code: express.val(),
                    store_out_express_company: express.find('option:selected').text(),
                    store_out_express_number: number.val()
                };

                if(valid && postData.store_out_id){
                    btn.prop('disabled', true);
                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        data: postData,
                        url: '/manage/store/storeoutsend',
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
                return false;
            });
        }
    };

    $(document).ready(page.init);
})(jQuery, window, document);
