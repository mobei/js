/**
 * [常用dom操作，一般用在没有jquery的时候作为一个简单地替代，之前做js sdk时使用过]
 * @type {Object}
 */

var doc = document || {};
var root = this;

var dom = {
    find: function(selector, context) {
        context = context || doc;
        return context.querySelector(selector);
    },
    findAll: function(selector, context) {
        context = context || doc;
        return context.querySelectorAll(selector) || [];
    },
    createEl: function(tagName, attrs) {
        if (typeof tagName === "object") {
            attrs = tagName;
            tagName = "";
        }

        attrs = attrs || {};

        var el = doc.createElement(tagName || 'div');
        var css = attrs.css;
        delete attrs.css;

        for (var k in attrs) {
            el[k] = attrs[k];
        }

        css && dom.css(el, css);

        return el;
    },
    removeEl: function(selector, content) {
        var els = this.find(selector, content);
        util.each(els, function(el) {
            el.parentNode.removeChild(el);
        });
    },
    hasClass: function(classNames, className) {
        return RegExp("\\b" + (className || "") + "\\b").test(classNames || "");
    },
    css: function(el, name, val) {
        if (!el || !name) return;

        if (typeof name === 'object') {
            for (var k in name) {
                el.style[k] = name[k];
            }
        } else if (val === undefined) {
            val = (root.getComputedStyle ? root.getComputedStyle(el, null) : el.currentStyle)[name] || "";
            if (val === "auto") return 0;
            if (val.slice(val.length - 2) === "px") {
                var _val = parseFloat(val);
                return !isNaN(_val) ? _val : val;
            }
            return val;
        } else {
            el.style[name] = val;
        }
    },
    /**
        style: "box-shadow: 1px 1px 8px #eee;box-sizing: border-box;"
    */
    css3: function(style) {
        var result = "";
        util.each((style || "").split(";"), function(attr) {
            if (attr) {
                result += attr + ";";
                util.each(["-webkit-", "-moz-", "-ms-", "-o-"], function(prefix) {
                    result += prefix + attr + ";";
                });
            }
        });
        return result;
    },
    cssJoin: function(el, keys) {
        var obj = {};
        if (el) {
            keys = (keys || "").split(",");
            for (var i = 0, l = keys.length; i < l; i++) {
                obj[keys[i]] = dom.css(el, keys[i]);
            };
        }
        return obj;
    },
    outerWidth: function(el) {
        var result = 0;
        var css = dom.cssJoin(el, "width,paddingLeft,paddingRight,borderLeft,borderRight");
        for (var k in css) {
            result += parseFloat(css[k]) || 0;
        }
        return result;
    },
    outerHeight: function(el) {
        var result = 0;
        var css = dom.cssJoin(el, "height,paddingTop,paddingBottom,borderTop,borderBottom");
        for (var k in css) {
            result += parseFloat(css[k]) || 0;
        }
        return result;
    },
    getEvent: function(ev) {
        return ev || root.event;
    },
    /*on: function(el, type, fn) {
        if (!el) return;
        el.addEventListener ? el.addEventListener(type, fn, false) : el.attachEvent("on" + type, fn);
    },
    un: function(el, type, fn) {
        if (!el) return;

        el.removeEventListener ? el.removeEventListener(type, fn, false) : el.detachEvent("on" + type, fn);
    },*/
    stopPropagation: function(ev) {
        ev = this.getEvent(ev);

        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    },
    getOffset: function(el) {
        var left = 0;
        var top = 0;

        while (el && (el != bodyEl)) {
            left += el.offsetLeft;
            top += el.offsetTop;
            el = el.offsetParent;
        }

        return { top: top, left: left };
    },
    formatSize: function(size) {
        if (size && parseFloat(size) == size)
            return size + "px";
        return size;
    },
    hide: function(el) {
        el && this.css(el, 'display', 'none');
    },
    show: function(el, type) {
        type = type || 'block';
        el && this.css(el, 'display', type);
    },
    text: function(el, content) {
        if (!el) return;
        if (content === undefined) {
            return (typeof el.textContent == "string") ? el.textContent : el.innerText;
        }
        if (typeof el.textContent == "string") {
            el.textContent = content;
        } else {
            el.innerText = content;
        }
    }
};
