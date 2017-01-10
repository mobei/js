 var FLAG = 'flag_';
 var GUID = 0;
 var doc = document;
 var root = window;
 var util = {
     isTestENV: function() {
         // if (location.protocol === "file:")
         //     return true;
         // return /(ud|tiyanudesk|(udesk(.+)?)).com$/i.test(location.host);
     },
     jsonp: function(url, cb) {
         if (!url) return;

         var cbName = FLAG + "jsonp" + (GUID++);
         url += (url.indexOf("?") > -1 ? "&" : "?") + "callback=" + cbName;

         var script = doc.createElement("script");
         bodyEl.appendChild(script);
         root[cbName] = function(res) {
             cb && cb(res);
         };

         script.src = url;
     },
     replaceTpl: function(tpl, data) {
         if (!tpl) return "";
         if (!data) return tpl;

         var html = tpl;
         for (var k in data) {
             html = html.replace(new RegExp('{' + k + '}', "gm"), data[k] || '');
         }
         return html;
     },
     parseJSON: function(str) {
         if (!str) return;
         if (root.JSON) return JSON.parse(str);

         return eval("(function(){return " + str + ";})()");
     },
     extend: function(tar) {
         if (!tar) return tar;

         util.each(arguments, function(obj, idx) {
             if (idx > 0) {
                 if (obj) {
                     for (var key in obj) {
                         tar[key] = obj[key];
                     }
                 }
             }
         });
         return tar;
     },
     each: function(obj, fn) {
         if (!obj) return;

         var len = obj.length;
         if (len !== undefined) {
             for (var i = 0; i < len; i++) {
                 if (false === fn(obj[i], i)) break;
             }
         } else {
             for (var k in obj) {
                 if (false === fn(obj[k], k)) break;
             }
         }
     },
     getReferrer: function() {
         var referrer;

         try {
             referrer = root.top.document.referrer;
         } catch (ex) {
             try {
                 referrer = root.parent.document.referrer;
             } catch (ex) {}
         }

         if (!referrer) referrer = document.referrer;

         if (!referrer) {
             if (root.opener) {
                 try {
                     // ie下如果跨域则抛出权限异常
                     // safari和chrome下window.opener.location没有任何属性
                     referrer = root.opener.location.href;
                 } catch (ex) {}
             }
         }
         return referrer || '';
     },
     /*isMob: function() {
         return /(android|blackberry|iphone|ipad|ipod|ios|iemobile)/.test(na);
     },*/
     messageListener: function(cb) {
         //data类型：hidePanel,newMsg,clearUnread
         if (root.addEventListener) {
             root.addEventListener('message', function(e) {
                 var data = JSON.parse(e.data) || {};
                 cb && cb(data);
             });
         } else {
             root.attachEvent('onmessage', function(e) {
                 var data = JSON.parse(e.data) || {};
                 cb && cb(data);
             });
         }
     },
     sendMessage: function(data, currWindow) {
         try {
             data = JSON.stringify(data) || '';
             currWindow.postMessage(data, imApiPath);
         } catch (e) {}
     },
     store: function(key, val) {
         key = "UDESK_" + key;

         var store = root.localStorage || {};
         if (val === undefined)
             return store[key] || "";
         store[key] = val || "";
     },
     storageListener: function(cb) {
         try {
             if (root.addEventListener) {
                 root.addEventListener("storage", function(e) {
                     cb && cb(e);
                 });
             } else {
                 if (document.attachEvent && !K.Browser.opera) {
                     document.attachEvent("onstorage", function(e) {
                         cb && cb(e);
                     });
                 } else {
                     root.attachEvent("onstorage", function(e) {
                         cb && cb(e);
                     });
                 };
             }
         } catch (e) {}
     },
     urlParams: function(url) {
         if (!url) return;

         var obj = {},
             arr = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
         if (arr) {
             for (var i = 0, l = arr.length; i < l; i++) {
                 try {
                     var _obj = arr[i].substring(1).split('='),
                         key = decodeURIComponent(_obj[0]),
                         val = decodeURIComponent(_obj[1]);
                     obj[key] = val;
                 } catch (e) {}
             }
         }
         return obj;
     },
     /**
         序列化一个对象，用于一个URL 地址查询字符串或Ajax请求。
     */
     urlString: function(obj, encode) {
         var url = "";
         if (obj) {
             for (var k in obj) {
                 url += "&" + k + "=" + (encode ? encodeURIComponent(obj[k] || "") : obj[k] || "");
             }
         }
         return url ? url.substring(1) : "";
     },
     parseUrl: function(url) {
         url = url || "";

         var arr = url.split("//"),
             protocol = arr[0] || "",
             host = (arr[1] || "").split("/")[0];

         return {
             protocol: protocol,
             host: host
         };
     },
     /** 判断是否IE
         @version 版本号
         @operator
            lt：小于运算符。如果第一个参数小于第二个参数，则返回true。
            lte：小于或等于运算。如果第一个参数是小于或等于第二个参数，则返回true。
            gt：大于运算符。如果第一个参数大于第二个参数，则返回true。
            gte：大于或等于运算。如果第一个参数是大于或等于第二个参数，则返回true。
     */
     ifIE: function(version, operator) {
         var el = document.createElement("b");
         el.innerHTML = "<!--[if " + (operator || "") + " IE " + (version || "") + "]><i></i><![endif]-->";

         return el.getElementsByTagName("i").length === 1;
     }
 };
 var dom = {
     find: function(selector, context) {
         // var result = [];

         // if (selector) {
         //     if (selector.indexOf("#") === 0) {
         //         result = doc.getElementById(selector.slice(1));
         //         result && (result = [result]);
         //     } else if (selector.indexOf(".") === 0) {
         //         result = this.getByClass(selector.slice(1), context);
         //     } else {
         //         result = context.getElementsByTagName(selector);
         //     }
         // }

         context = context || containerEl;

         return context.querySelectorAll(selector) || [];
     },
     // getByClass: function(className, context) {
     //     className = className || "";
     //     context = context || doc;
     //     var key = "getElementsByClassName";
     //     if (context[key]) return context[key](className) || [];

     //     var result = [];
     //     var all = context.getElementsByTagName('*');
     //     for (var i = 0, l = all.length; i < l; i++) {
     //         if (this.hasClass(all[i].className, className)) {
     //             result.push(all[i]);
     //             break;
     //         }
     //     }
     //     return result;
     // },
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
