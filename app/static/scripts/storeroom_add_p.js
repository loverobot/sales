;(function($, window, document, undefined){
    'use strict';

    var pageReady = function(){

        var form = $('#storeroom_add_p');
        var result = $('#result');
        var resultShow = $('#result-show');
        
        //表单验证
        form.validate({
            rules: {
                store_in_batch_list: {
                    required: true
                }
            },
            messages: {
                store_in_batch_list: {
                    required: '内容不能为空'
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

        //表单提交
        form.on('submit', function(){
            var valid = form.valid();
            var btn = form.find('[type="submit"]');
            var postData = {
                store_in_batch_list: $('textarea[name="store_in_batch_list"]').val()    
            };

            if(valid){
                btn.prop('disabled', true);
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data: postData,
                    url: '/manage/store/storeinbatchsubmit',    
                }).done(function(res){
                    if(parseInt(res.code) === 0){
                        result.val(JSON.stringify(res.data)).trigger('change');
                    } else {
                        result.val(JSON.stringify([{
                        store_in: res.msg,
                        type: '0'
                    }])).trigger('change');    
                    }
                    
                }).fail(function(){
                    result.val(JSON.stringify([{
                        store_in: '交互失败稍候再试',
                        type: '0'
                    }])).trigger('change');
                }).always(function(){
                    btn.prop('disabled', false);    
                });
            }
            return false;
        });
        
        result.on('change', function(){
            var val = $(this).val();
            var items = '';
            val = val ? val : [];
            console.log(val);
            val = typeof(val) === 'string' ? JSON.parse(val) : val;
            
            resultShow.empty();
            $.each(val, function(k, v){
                var bg = parseInt(v.type) === 0 ? 'list-group-item-danger' : 'list-group-item-success';
                var i = parseInt(v.type) === 0 ? 'glyphicon glyphicon-remove text-danger' : 'glyphicon glyphicon-ok text-success';
                items += '<li class="list-group-item '+ bg +'">'+ v.store_in +'<i class="'+ i +'"></i></li>';   
            });
            if(items){
                resultShow.html('<ul class="list-group">'+ items +'</ul>');    
            }
        });
    };

    $(document).ready(pageReady);

})(jQuery, window, document);
