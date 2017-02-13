 var FLAG = 'flag_';
 var GUID = 0;
 var doc = document;
 var root = window;
 var util = {
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
     messageListener: function(cb) {
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
         key = "_" + key;

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
