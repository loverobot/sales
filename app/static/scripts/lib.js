'use strict';

//全局方法注册
var nosh = {};

/* 简单发布订阅模式
 * 使用范例：
 * $(function () {
 *     $.getJSON('data.json', function (results) {
 *         $.publish('add', results);
 *     });
 *     $.subscribe('add', function(e, results) {
 *         $('body').html(results.one);
 *     });
 * });
 */
nosh.pubSub = $({}); //自定义事件对象
$.each({
    trigger: 'publish', //发布
    on: 'subscribe', //订阅
    off: 'unsubscribe' //取消订阅
}, function(key, val) {
    $[val] = function() {
        nosh.pubSub[key].apply(nosh.pubSub, arguments);
    };
});

/* 载入svg
 * @param svgs { string, array } svgurl ex: 'path/ex.svg', 'path/ex1.svg, path/ex2.svg', ['path/ex1.svg', 'path/ex2.svg']
 * @param host { string } 域名 ex: "http://www.example.com/"
 */
nosh.loadSvg = function(svgs, host){
    if(svgs){
        var type = typeof(svgs);
        var ajax = function(url){
            url = $.trim(url);
            host = host ? host : '/';
            if(url){
                $.ajax({
                    type: 'GET',
                    dataType: 'text',
                    url: host + url,
                    success: function(data){
                        $('head').append(data);
                    },
                    error: function(){
                        console.log('载入svg图像出错');
                    }
                });
            }
        };
        if(type === 'string'){
            svgs = svgs.split(',');
        }
        for(var i=0; i<svgs.length; i++){
            ajax(svgs[i]);
        }
    }
};

/* SVG JS模板
 * @param file svg symbol filename ex: gift (app/static/svgs/global/gift.svg)
 * @return html
 */
nosh.svg = function(file){
    var html = '<svg role="img" class="icon-svg icon-svg-'+ file +'">'+
        '  <use xlink:href="#svgicon-'+ file +'"></use>'+
        '</svg>';
    return html;
};


/*autocomplete*/
nosh.autocompleteCurr = null;
nosh.autocompleteIsHide = true;
nosh.autocompleteInit = function(){
    var $box = $('<div class="mj-autocomplete" id="mj-autocomplete"></div>');
    $box.appendTo('body').hide();
    
    $(document).on('keyup', function(event){
        var code = parseInt(event.keyCode);
        if(nosh.autocompleteCurr){
            var first = $box.find('a:first');
            var last = $box.find('a:last');
            var curr = $box.find('.active');
            
            curr = curr.length === 0 ? first : curr;
            
            var next = curr.next();
            var prev = curr.prev();
            
            next = next.length === 0 ? first : next;
            prev = prev.length === 0 ? last : prev;
            
            if(code === 38){ //向上
                curr.removeClass('active');
                prev.addClass('active');
            }

            if(code === 40){ //向下
                curr.removeClass('active');
                next.addClass('active');
            }
            
            if(code === 13){ //回车
                $box.find('.active').trigger('click');
                $box.hide();
                nosh.autocompleteCurr.blur();
            }
            
            if(code === 27){ //esc
                $box.hide();
                nosh.autocompleteCurr.blur();
            }
        }
    });
    
    $box.on('click', 'a', function(){
        nosh.autocompleteCurr.val($(this).text()).trigger('autocompleteDone', [$(this).data('id')]);
        return false;    
    });
    $box.on('mouseenter', function(){
        nosh.autocompleteIsHide = false;    
    }).on('mouseleave', function(){
        nosh.autocompleteIsHide = true;    
    });
};
nosh.autocomplete = function($input, url, cb){
    var self = this;
    if($input && $input.length > 0 && url){
        
        self.timer = null;
        self.delay = 300;
        self.maps = {};
        self.box = $('#mj-autocomplete');
        
        self.getStyles = function(){
            return {
                width: $input.outerWidth(),
                left: $input.offset().left,
                top: $input.offset().top + $input.outerHeight() - 2
            };    
        };   
        
        self.ajax = function(){
            return $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                data: { words: $input.val() },
                success: function(res){
                    if(parseInt(res.code) === 0){
                        self.maps = res.data;
                        self.change();
                    } else {
                        self.maps = {};
                    }    
                },
                error: function(){
                    self.maps = {};    
                }
            });    
        };
        
        self.change = function(){
            var items = '';
            var i = 0;
            $.each(self.maps, function(k, v){
                var active = i > 0 ? '' : ' active';
                items += '<a href="javascript:;" class="list-group-item'+ active +'" data-id="'+ k +'">'+ v.text +'</a>';
                i++;
            });
            if(items){
                items = '<div class="list-group">'+ items +'</div>';
                self.box.html(items).css(self.getStyles()).show();
            } else {
                self.box.empty().hide();
            }
        };
        
        $input.on('focus', function(){
            nosh.autocompleteCurr = $(this);
            if(self.timer){
                clearTimeout(self.timer);
            }
            self.timer = setTimeout(function(){
                if($input.val()){
                    self.ajax();  
                } 
            }, self.delay);
        });
        
        $input.on('blur', function(){
            if(nosh.autocompleteIsHide){
                nosh.autocompleteCurr = null;
                self.box.hide();
            }
        });
        
        $input.on('input', function(){
            if(self.timer){
                clearTimeout(self.timer);
            }
            self.timer = setTimeout(function(){
                if($input.val()){
                    self.ajax();    
                } 
            }, self.delay);
        });
        
        $input.on('autocompleteDone', function(){
            var id = arguments[1];
            if(cb && $.isFunction(cb)){
                cb(self.maps[id]);
            }
            
            if(!nosh.autocompleteIsHide){
                self.box.hide();    
            }
        });
        
    }
    return self;
};