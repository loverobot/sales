;(function($, window, document, undefined){
    'use strict';

    var page = {
        form: $('#login-form'),
        valid: function(){
            var form = page.form;
            form.validate({
                rules: {
                    user_name: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                    verify: {
                        required: true
                    }
                },
                messages: {
                    user_name: {
                        required: '请输入用户名'
                    },
                    password: {
                        required: '请输入密码'
                    },
                    verify: {
                        required: '请输入验证码'
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

            $('.code-img').on('click', 'a', function(){
                var img = $(this).find('img');
                var src = img.data('src');
                var rand = Math.random();
                src = src +'?times='+ rand;
                img.attr('src', src);
                return false;
            });
        }
    };

    $(document).ready(page.init);

})(jQuery, window, document);
