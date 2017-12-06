;(function($, window, document, undefined){
    'use strict';
    
    var page = {
        form: $('#storein-add-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    store_in_store_id: {
                        required: true
                    },
                    store_in_type: {
                        required: true
                    },
                    store_in_goods_name: {
                        required: true
                    },
                    store_in_goods_num: {
                        required: true,
                        digits: true,
                        min: 1
                    }
                },
                messages: {
                    store_in_store_id: {
                        required: '请选择入库仓库'
                    },
                    store_in_type: {
                        required: '请选择入库类型'
                    },
                    store_in_goods_name: {
                        required: '请选择产品名称'
                    },
                    store_in_goods_num: {
                        required: '请填写入库数量',
                        digits: '请输入正整数',
                        min: '请输入比1大的整数'
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
            
            $('.mj-fill-data').on('change', function(){
                var select = $(this).find('option:selected');
                var code = select.data('code');
                var statusText = '';
                var status = select.data('status');
                var codeInput = $('input[name="store_in_goods_code"]');
                var statusInput = $('input[name="store_in_goods_state"]');
                var statusSInput = $('input[name="store_in_goods_state_s"]');
                
                code = code ? code : '';
                status = status ? status : '';
                if(parseInt(status) === 1){
                    statusText = '良品';     
                } else if(parseInt(status) === 2){
                    statusText = '不良品';           
                }
                
                codeInput.val(code);
                statusInput.val(status);
                statusSInput.val(statusText);
            });
        }
    };
    
    $(document).ready(page.init);
    
})(jQuery, window, document);
