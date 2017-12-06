;(function($, window, document, undefined){
    'use strict';

    var page = {
        form: $('#storeroom-add-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    store_name: {
                        required: true
                    },
                    store_province: {
                        required: true
                    },
                    store_city: {
                        required: true
                    },
                    store_area: {
                        required: true
                    },
                    store_address: {
                        required: true
                    }
                },
                messages: {
                    store_name: {
                        required: '请填写仓库名称'
                    },
                    store_province: {
                        required: '请选择省'
                    },
                    store_city: {
                        required: '请选择市'
                    },
                    store_area: {
                        required: '请选择区'
                    },
                    store_address: {
                        required: '请填写详细地址'
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
            self.valid();

            //省市区联动
            nosh.chinaAddr.init($('.mj-china-addr'));

            var storeState = $('input[name="store_state"]').data('value');
            if(storeState !== ''){
                $('input[name="store_state"]').val(storeState);
            }
        }
    };

    $(document).ready(page.init);

})(jQuery, window, document);
