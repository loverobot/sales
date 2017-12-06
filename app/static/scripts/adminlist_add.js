;(function($, window, document, undefined){
    'use strict';

    var page = {
        form: $('#add-user-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    name: {
                        required: true/*,
                        remote:{
                            type: 'GET',
                            url: '/api/shop/checkname',
                            dataType: 'jsonp',
                            data: { name: function(){ return $('input#username').val(); }}
                        }*/
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    name: {
                        required: '请输入登录名称'
                    },
                    password: {
                        required: '请输入登录密码'
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
        }
    };

    $(document).ready(page.init);

})(jQuery, window, document);
