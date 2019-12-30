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

        self.navInit(self.nav_bar, self.container);
        self.onScrollVertical(self.nav_bar, self.ele_width, self.container, window);
        self.navClick(self.nav_bar);
    }

    // 原型链上提供的方法
    navigation.prototype = {
        // 导航栏初始设置
        navInit: function (ele_nav, ele_container) {
            // 导航栏占位元素高度和导航栏保持一致
            $(ele_nav).prev().css({ 'height': $(ele_nav).outerHeight() });
            // 遍历页面虚拟坐标,并为其添加index
            $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                $(element).addClass('hidden_nav');
                $(element).attr('data-navIndex', index);
            });
            // 遍历导航栏按钮,并为其添加index
            $(ele_nav).children().eq(0).find('.nav_bar_item').each(function (index, element) {
                $(element).attr('data-navIndex', index);
            });
            // 保存虚拟坐标位置
            self.temlist = [];
            $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                self.temlist.push($(element).offset().top);
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
        onScrollVertical: function (ele_nav, ele_width, ele_container, window) {
            var _this = this;
            var scrollTimer = null;
            var top = $(window).scrollTop();
        // 一
            var oldTop = $(window).scrollTop();
            // 监听滚动事件
            $(window).scroll(function rollEvent() {
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                top = $(window).scrollTop();
                if (top === oldTop) {
                    // 更新虚拟坐标位置
                    self.temlist = [];
                    $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
                        self.temlist.push($(element).offset().top);
                    });

                    if ($(ele_nav).parent().offset().top <= top) {
                        $(ele_nav).css({ 'position': 'fixed', 'z-index': 99 });
                        for (let [index, value] of self.temlist.entries()) {
                            if (value <= top + $(ele_nav).outerHeight()) {
                                if (index != self.temlist.length - 1) {
                                    if (self.temlist[index + 1] > top + $(ele_nav).outerHeight()) {
                                        $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
                                        break;
                                    }
                                } else {
                                    $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
                                }
                            }
                        }
                    } else {
                        $(ele_nav).css({ 'position': 'absolute', 'z-index': 9 });
                        $($(ele_nav).children().eq(0).find('.nav_bar_item')[0]).addClass('linkActive').siblings().removeClass('linkActive');
                    }
                    _this.onScrollLevel(ele_nav, ele_width);
                } else {
                    oldTop = top;
                    scrollTimer = setTimeout(() => {
                        rollEvent();
                    }, 100);
                }
            });

        // 二
            // $(window).scroll(function () {
            //     clearTimeout(scrollTimer);
            //     scrollTimer = setTimeout(() => {
            //         console.log('111');
            //         // 更新虚拟坐标位置
            //         self.temlist = [];
            //         $(ele_container).find('div[data-anchor="true"]').each(function (index, element) {
            //             self.temlist.push($(element).offset().top);
            //         });

            //         top = $(window).scrollTop();
            //         if ($(ele_nav).parent().offset().top <= top) {
            //             $(ele_nav).css({ 'position': 'fixed', 'z-index': 99 });
            //             for (let [index, value] of self.temlist.entries()) {
            //                 if (value <= top + $(ele_nav).outerHeight()) {
            //                     if (index != self.temlist.length - 1) {
            //                         if (self.temlist[index + 1] > top + $(ele_nav).outerHeight()) {
            //                             $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
            //                             break;
            //                         }
            //                     } else {
            //                         $($(ele_nav).children().eq(0).find('.nav_bar_item')[index]).addClass('linkActive').siblings().removeClass('linkActive');
            //                     }
            //                 }
            //             }
            //         } else {
            //             $(ele_nav).css({ 'position': 'absolute', 'z-index': 9 });
            //             $($(ele_nav).children().eq(0).find('.nav_bar_item')[0]).addClass('linkActive').siblings().removeClass('linkActive');
            //         }
            //         _this.onScrollLevel(ele_nav, ele_width);
            //     });
            // });
        // 一和二感觉差不多,但是一的定时器时间设置的长用户体验不好,时间设置的短又感觉有点违和
        // 另外部分Android机型触发scroll事件可能不按照正确方式触发,监听scroll事件有几率出现bug

        },
        // 导航栏按钮点击事件
        navClick: function (ele_nav) {
            $(ele_nav).children().eq(0).find('.nav_bar_item').on('click', function () {
                var obj = $(this);
                var temlocation;
                if (obj.attr('data-navIndex') == 0) {
                    temlocation = $(ele_nav).parent().offset().top;
                } else {
                    temlocation = self.temlist[Number(obj.attr('data-navIndex'))] - $(ele_nav).outerHeight() + 5;
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