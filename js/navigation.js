// ;防止跟其他js压缩时报错
; (function (window, document) {
    // 开启严格模式
    "use strict";

    function navigation(options) {
        var self = this;
        if (!options) {
            throw new Error("请传入配置参数");
        }
        self = Object.assign(self, options);
        self.nav_bar = document.querySelector(self.nav_bar) || document.querySelectorAll(self.nav_bar);
        self.container = document.querySelector(self.container) || document.querySelectorAll(self.container);
        self.ele_width = self.ele_width;

        self.navInit(self.nav_bar, self.container, window);
        self.onScrollVertical(self.nav_bar, self.ele_width, window);
        self.navClick(self.nav_bar, self.container, window);
    }

    // 原型链上提供的方法
    navigation.prototype = {
        // 导航栏初始设置
        navInit: function (ele_nav, ele_container, window) {
            // 遍历页面虚拟坐标,并为其添加index
            $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                $(element).addClass('hidden_nav');
                $(element).attr('data-navIndex', index);
            });
            // 遍历导航栏按钮,并为其添加index
            $(ele_nav).children().eq(0).find('.nav_bar_item').each(function (index, element) {
                $(element).attr('data-navIndex', index);
            });
            // 监听滚动事件,更新虚拟坐标位置
            $(window).scroll(function () {
                self.temlist = [];
                $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                    self.temlist.push($(element).offset().top);
                });
            });
        },
        // 导航栏水平滑动
        onScrollLevel: function (ele_nav, ele_width) {
            var activityIndex = null;
            activityIndex = Number($('.linkActive').eq(0).attr('data-navIndex')) + 1;
            if (activityIndex != null) {
                // $(ele_nav).children().eq(0).scrollLeft((activityIndex - 1) * ele_width);
                var timer = setTimeout(function () {
                    $(ele_nav).children().eq(0).stop().animate({
                        scrollLeft: (activityIndex - 1) * ele_width + 'px'
                    }, 'fast', 'linear');
                    clearTimeout(timer);
                }, 100);
            }
        },
        // 内容竖直方向滑动
        onScrollVertical: function (ele_nav, ele_width, window) {
            var _this = this;
            // 监听滚动事件
            $(window).scroll(function () {
                var top = $(window).scrollTop();
                if (top >= ($(ele_nav).prev().outerHeight() + $(ele_nav).prev().offset().top)) {
                    $(ele_nav).css({ 'position': 'fixed', 'top': '0', 'z-index': 99 });
                    self.temlist.map(function (value, index, arr) {
                        if (value <= top + $(ele_nav).outerHeight()) {
                            if (index != arr.length - 1) {
                                if (self.temlist[index + 1] > top + $(ele_nav).outerHeight()) {
                                    $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
                                }
                            } else {
                                $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
                            }
                        }
                    });
                } else {
                    $(ele_nav).css({ 'position': 'relative', 'top': 'auto', 'z-index': 9 });
                    $($(ele_nav).children().eq(0).find('.nav_bar_item')[0]).addClass('linkActive').siblings().removeClass('linkActive');
                }
                _this.onScrollLevel(ele_nav, ele_width);
            });
        },
        // 导航栏按钮点击事件
        navClick: function (ele_nav, ele_container, window) {
            $(ele_nav).children().eq(0).find('.nav_bar_item').on('click', function () {
                var obj = $(this);
                var temlocation;
                if (obj.attr('data-navIndex') == 0) {
                    temlocation = 0;
                } else {
                    self.lastActiveIndex = $('.linkActive').eq(0).attr('data-navIndex');
                    if (self.lastActiveIndex == 0 && $(window).scrollTop() <= ($(ele_nav).prev().outerHeight() + $(ele_nav).prev().offset().top)) {
                        self.temlist = [];
                        $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                            self.temlist.push($(element).offset().top);
                        });
                        // *3:原先nav存在文档流中,滑动以后nav脱离了文档流,底下的内容顶上但是要滑到相同的位置所以*2,又因为nav固定在顶部遮挡了内容所以*3(猜的)
                        temlocation = self.temlist[Number(obj.attr('data-navIndex'))] - $(ele_nav).outerHeight() * 3 + 5;
                    } else {
                        temlocation = self.temlist[Number(obj.attr('data-navIndex'))] - $(ele_nav).outerHeight() + 5;
                    }
                }
                var timer = setTimeout(function () {
                    $('body,html').stop().animate({
                        scrollTop: temlocation
                    }, 'fast', 'linear');
                    clearTimeout(timer);
                }, 500);
            });
        }
    }

    // 兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = navigation;
    };

    // 兼容AMD/CMD规范
    if (typeof define === 'function') define(function () {
        return navigation;
    });

    // 注册全局变量,兼容使用script标签引入插件
    window.navigation = navigation;
})(window, document);