;(function($, window, document, undefined){
    'use strict';
    
    //价格分摊验证
    jQuery.validator.addMethod(
        'v_price_show',
        function(value, element){
            var res = true;
            var total = 0;
            var data = $('#mj-package-list').val();
            data = data ? data : [];
            data = typeof(data) === 'string' ? JSON.parse(data) : data;

            $.each(data, function(){
                var v = arguments[1];
                if(v.share_price){
                    total = Decimal.add(total, v.share_price).toString();
                }
            });

            if($(element).attr('name') !== 'package_list'){
                total = Decimal.add(total, value).toFixed(2);
                if(total > 100 || total <= 0){
                   res = false;
                }
            } else {
                if(Number(total) !== 100){
                   res = false;
                }
            }
            return this.optional(element) || res;
        },
        $.validator.format('价格分摊不能超过100%！')
    );

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
                    },
                    package_list: {
                        required: true,
                        v_price_show: true
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
                    },
                    package_list: {
                        required: '请填写相关产品',
                        v_price_show: '价格分摊总额必须是100%！'
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
            
            //autocomplete
            nosh.autocompleteInit();
            new nosh.autocomplete($('#mj-get-products'), '/manage/goods/getrelsinglesajax', function(d){
                $('#mj-get-products-info').val(JSON.stringify(d)); 
            });
            
            //辅助表单添加验证
            var f = $('#add-products');
            f.validate({
                rules: {
                    mj_get_products: {
                        required: true
                    },
                    share_price: {
                        required: true,
                        number: true,
                        min: 0,
                        max: 100,
                        v_price_show: true
                    }
                },
                messages: {
                    mj_get_products: {
                        required: '产品不能为空'
                    },
                    share_price: {
                        required: '请输入分摊价格',
                        number: '请输入合法的数字',
                        min: '最小值为0',
                        max: '最大值为100',
                        v_price_show: '价格分摊总额不能超过100%！'
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
            
            var ps = $('#mj-package-list');
            var tbody = $('#mj-package-show');
            
            //添加产品 {"id":"1", "text":"text", "code":"code"}
            var addPs = function(d){
                var val = ps.val();
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                val.push(d);
                ps.val(JSON.stringify(val)).trigger('change');
            };
            
            var delPs = function(index){
                var val = ps.val();
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                val.splice(index, 1);
                
                val = val.length === 0 ? '' : JSON.stringify(val);
                ps.val(val).trigger('change');
            };
            
            var editPs = function(d, index){
                var val = ps.val();
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                val[index].share_price = d;
                ps.val(JSON.stringify(val)).trigger('change').trigger('blur');
            };

            $('body').on('change', '.show-price-item', function(){
                var v = Number($(this).val()).toFixed(2);
                editPs(v, $(this).data('index'));
            });

            ps.on('change', function(){
                var val = ps.val();
                var items = '';
                val = val ? val : [];
                val = typeof(val) === 'string' ? JSON.parse(val) : val;
                $.each(val, function(k, v){
                    items += '<tr>'+
                        '    <td>'+ (k+1) +'</td>'+
                        '    <td>'+ v.text +'</td>'+
                        '    <td>'+ v.code +'</td>'+
                        '    <td><div class="input-group"><input type="text" class="form-control show-price-item" value="'+ Number(v.share_price).toFixed(2) +'" autocomplete="off" data-index="'+ k +'"><div class="input-group-addon">%</div></div></td>'+
                        '    <td>'+
                        '        <a href="javascript:;" class="btn btn-xs btn-danger del" data-index="'+ k +'">删除</a>'+
                        '    </td>'+
                        '</tr>';
                });

                if(!items){
                   items = '<tr><td colspan="5"><p class="text-center text-muted">暂无产品</p></td></tr>';
                }
                tbody.html(items);
            });
            tbody.on('click', '.del', function(){
                var index = $(this).data(index);
                delPs(index);
            });
            
            f.on('submit', function(){
                if(f.valid()){
                    var d = {};
                    var info = $('#mj-get-products-info').val();
                    d = JSON.parse(info);
                    d.share_price = Number($('input[name="share_price"]').val()).toFixed(2);
                    addPs(d);
                    f[0].reset();
                }
                return false;    
            });
            
            $('button[form="add-products"]').on('click', function(){
                f.submit();
                return false;
            });

            ps.trigger('change');
        }
    };
    
    $(document).ready(page.init);
    
})(jQuery, window, document);
