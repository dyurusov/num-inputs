!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=5)}([function(t,e,r){"use strict";var n,o=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0});var i=r(2),s=r(10),u=r(4),a=function(t){function e(e){return t.call(this,e,new s.NumericParser,new u.NumericDomBuilder({classNames:{wrapper:"number-input-widget"}}))||this}return o(e,t),e}(i.Control);e.default=a},function(t,e,r){"use strict";var n,o=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0});var i=r(2),s=r(11),u=r(12),a=function(t){function e(e){return t.call(this,e,new s.CalcParser,new u.CalcDomBuilder({classNames:{wrapper:"calc-input-widget"}}))||this}return o(e,t),e}(i.Control);e.default=a},function(t,e,r){"use strict";var n,o=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(e,r,n){var o=t.call(this)||this;return o.parser=r,o.domBuilder=n,o._value=null,o._text="",o.domBuilder.bindOwner(o),o._hostElement=(e instanceof HTMLElement?e:document.getElementById(e))||void 0,o.mount(),o}return o(e,t),e.prototype.mount=function(){!this.hostElement||this.hostElement.innerHTML.trim()||this.domBuilder.isMounted||this.domBuilder.mount(this.hostElement)},e.prototype.destroy=function(){this.domBuilder.isMounted&&(this.clearListeners(),this.domBuilder.unmount())},Object.defineProperty(e.prototype,"hostElement",{get:function(){return this._hostElement},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isMounted",{get:function(){return this.domBuilder.isMounted},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isValid",{get:function(){return void 0!==this._value},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"value",{get:function(){return this._value},set:function(t){var e=this;this.trackChanges((function(){var r=e.parser.parse(t);null==r?(e._value=null,e._text=""):(e._value=r,e._text=e._value.toString())}))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"text",{get:function(){return this._text},set:function(t){var e=this;this.trackChanges((function(){e._text=t,e._value=e.parser.parse(t)}))},enumerable:!0,configurable:!0}),e.prototype.trackChanges=function(e){return t.prototype.trackChanges.call(this,e,["value","text","isValid"])},e}(r(9).ChangeTracker);e.Control=i},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(){}return t.parseNumeric=function(t){if("number"==typeof t)return isNaN(t)?null:t||0;if(null==t)return null;var e=t.trim();if(!e.length)return null;var r=e.match(/^(\+|-)?(\d*)\.?(\d*)$/);return r&&(r[2]||r[3])?("-"===r[1]?-1:1)*((r[2]?parseFloat(r[2]):0)+(r[3]?parseFloat("0."+r[3]):0))||0:void 0},t.parseExpression=function(e){var r=t.parseNumeric(e);if(void 0!==r)return r;try{var n=t.parseExpressionCondence(e.trim());return t.parseExpressionHandleBrackets(n)}catch(t){return}},t.parseExpressionCondence=function(t){if(t.match(/[^\d .+\-/*()]/))throw new Error("Invalid char");if(t.match(/[\d.]\s+[\d.]/))throw new Error("Space within number");var e=t.replace(/\s/g,"");if(e.match(/[-+/*][-+/*]/))throw new Error("Doubled actions");if(e.match(/(\(\)|\)\()/))throw new Error("Immediately adjacent unsimilar brackets");if((e.match(/\(/g)||[]).length!==(e.match(/\)/g)||[]).length)throw new Error("Invalid number of openning and closing brackets");if(e.match(/[\d.]\(/))throw new Error("No action before non-first opening bracket");if(e.match(/\)[\d.]/))throw new Error("No action after non-last closing bracket");return e},t.parseExpressionHandleBrackets=function(e){if(e.match(/^[*/]/))throw new Error("Multiplication or division on the first position");if(e.match(/[*/+-]$/))throw new Error("Multiplication, division, adding or substraction on the first position");for(var r=e,n=0;;){var o=r.indexOf("(",n),i=-1!==o,s=r.indexOf(")",n),u=-1!==s;if(!i){if(u)throw new Error("Closing bracket without opening one");break}if(!u)throw new Error("No closing bracket");if(o>s)throw new Error("Closing bracket befor opening one");var a=t.findClosingBracket(r,o),c=r.substring(o+1,a),l=t.parseNumeric(c);if(null===l)throw new Error("Empty numeric");var p=void 0===l?t.parseExpressionHandleBrackets(c):l,f=(p<0?"("+p+")":p).toString();r=r.substring(0,o)+f+r.substr(a+1),n=o+f.length+1}return t.parseExpressionHandleMultiplicationGroups(r)},t.findClosingBracket=function(t,e){if("("!==t[e])throw new Error("No opening bracket at start position");for(var r=0,n=e+1;n<t.length;n++){var o=t[n];if(")"===o){if(!r)return n;r--}else"("===o&&r++}throw new Error("Closing bracket is not found")},t.parseExpressionHandleMultiplicationGroups=function(e){var r=e,n=r[0],o=("+"===n||"-"===n?"+"===n?1:-1:0)?1:0,i=o;do{if("("===r[i]&&(i=t.findClosingBracket(r,i)),i+1<r.length){var s=r[i+1];if("+"!==s&&"-"!==s){i++;continue}}var u=r.substring(o,i+1),a=t.parseExpressionMultiply(u),c=a<0?"("+a+")":a.toString();r=r.substring(0,o)+c+r.substr(i+1),i=o=o+c.length+1}while(o<r.length);return t.parseExpressionAdding(r)},t.parseExpressionMultiply=function(e){var r=0,n=0,o=0,i=o,s=e.length;do{var u=!1;"("===e[i]&&(i=t.findClosingBracket(e,i),u=!0);var a=void 0;if(i+1<s&&"*"!==(a=e[i+1])&&"/"!==a)i++;else{var c=e.substring(u?o+1:o,u?i:i+1),l=t.parseNumeric(c);if(null===l&&void 0===l)throw new Error('Invalid numeric: "'+c+'"');r=n?n<0?r/l:r*l:l,a&&(n="*"===a?1:-1),i=o=i+2}}while(i<s);return r},t.parseExpressionAdding=function(e){var r=0,n=0,o=e[0],i="+"===o||"-"===o?"+"===o?1:-1:0,s=i?1:0,u=s,a=e.length;do{var c=!1;"("===e[u]&&(u=t.findClosingBracket(e,u),c=!0);var l=void 0;if(u+1<a&&"+"!==(l=e[u+1])&&"-"!==l)u++;else{var p=e.substring(c?s+1:s,c?u:u+1),f=t.parseNumeric(p);if(null===f&&void 0===f)throw new Error('Invalid numeric: "'+p+'"');n?r=n<0?r-f:r+f:(r=f,i&&(r*=i)),l&&(n="+"===l?1:-1),u=s=u+2}}while(u<a);return r},t}();e.default=n},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={wrapper:"control-widget",hasFocus:"has-focus",isInvalid:"is-invalid"},o=function(){function t(t){void 0===t&&(t={}),this._isMounted=!1,this.unsubscribers=[],this.classNames=Object.assign(n,t.classNames||{})}return t.prototype.bindOwner=function(t){this.owner=t},Object.defineProperty(t.prototype,"isMounted",{get:function(){return this._isMounted},enumerable:!0,configurable:!0}),t.prototype.mount=function(t){var e=this;if(!this.owner)throw new Error("Owner is not bound");this.isMounted||(this.wrapper=document.createElement("div"),this.wrapper.classList.add(this.classNames.wrapper),this.buildElements().forEach((function(t){return e.wrapper&&e.wrapper.append(t)})),t.append(this.wrapper),this._isMounted=!0)},t.prototype.unmount=function(){this.isMounted&&(this.unsubscribers.forEach((function(t){return t()})),this.wrapper&&this.wrapper.remove(),this.wrapper=void 0,this._isMounted=!1)},t.prototype.buildElements=function(){return[this.buildInput()]},t.prototype.buildInput=function(){var t=this,e=document.createElement("input");e.type="text",e.addEventListener("input",(function(){return t.owner&&(t.owner.text=e.value)})),e.addEventListener("focus",(function(){return t.wrapper&&t.wrapper.classList.add(t.classNames.hasFocus)})),e.addEventListener("blur",(function(){return t.wrapper&&t.wrapper.classList.remove(t.classNames.hasFocus)}));var r=function(e){return t.wrapper&&t.wrapper.classList[e?"remove":"add"](t.classNames.isInvalid)};this.owner&&this.unsubscribers.push(this.owner.on("isValidChanged",r));var n=function(t){e.value=t};return this.owner&&this.unsubscribers.push(this.owner.on("textChanged",n)),this.owner&&r(this.owner.isValid),this.owner&&n(this.owner.text),e},t}();e.NumericDomBuilder=o},function(t,e,r){"use strict";r.r(e);r(6),r(7),r(8);var n=r(0),o=r.n(n),i=r(1),s=r.n(i);const u=new o.a("numInputDefault"),a=new o.a("numInputCustom"),c=new s.a("calcInputDefault"),l=new s.a("calcInputCustom"),p=document.getElementById("tmpl");p&&[u,c].forEach(t=>{if(t.isMounted){const e=document.createElement("div");e.append(p.content.cloneNode(!0)),t.hostElement.after(e);const r=t=>e.querySelector(".property.value .val").innerHTML=t||"",n=t=>e.querySelector(".property.text .val").innerHTML=t||"",o=t=>e.querySelector(".property.valid .val").innerHTML=t?"true":"false";r(t.value),n(t.text),o(t.isValid),t.on("valueChanged",r),t.on("textChanged",n),t.on("isValidChanged",o),e.querySelector(".setter.value button").addEventListener("click",e=>t.value=e.target.parentElement.querySelector("input").value),e.querySelector(".setter.text button").addEventListener("click",e=>t.text=e.target.parentElement.querySelector("input").value)}});const f=document.getElementById("destroy-button");f&&f.addEventListener("click",()=>{[u,a,c,l].forEach(t=>t.destroy())})},function(t,e,r){},function(t,e,r){},function(t,e,r){},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t){void 0===t&&(t=new Map),this.listeners=t}return t.prototype.on=function(t,e){var r=this;return this.listeners.has(t)||this.listeners.set(t,[]),(this.listeners.get(t)||[]).push(e),function(){r.listeners.set(t,(r.listeners.get(t)||[]).filter((function(t){return t!==e})))}},t.prototype.clearListeners=function(){this.listeners.clear()},t.prototype.trackChanges=function(t,e){var r=this.takeSnapshotFor(e);t();var n=this.takeSnapshotFor(e);this.emitChangedEventsFor(e,r,n)},t.prototype.takeSnapshotFor=function(t){var e=this,r={};return t.forEach((function(t){r[t]=e[t]})),r},t.prototype.emitChangedEventsFor=function(t,e,r){var n=this;t.forEach((function(t){e[t]!==r[t]&&n.emit(t+"Changed",r[t])}))},t.prototype.emit=function(t,e){(this.listeners.get(t)||[]).forEach((function(t){return t(e)}))},t}();e.ChangeTracker=n},function(t,e,r){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=n(r(3)),i=function(t){void 0===t&&(t=o.default.parseNumeric),this.parse=t};e.NumericParser=i},function(t,e,r){"use strict";var n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=n(r(3)),i=function(t){void 0===t&&(t=o.default.parseExpression),this.parse=t};e.CalcParser=i},function(t,e,r){"use strict";var n,o=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});Object.defineProperty(e,"__esModule",{value:!0});var i=r(4),s="?",u=function(t){function e(e){void 0===e&&(e={});var r=t.call(this,e)||this;return r.invalidSign=e.invalidSign||s,r}return o(e,t),e.prototype.buildElements=function(){return[this.buildInput(),this.buildDisplay()]},e.prototype.buildDisplay=function(){var t=this,e=document.createElement("span");e.tabIndex=-1,e.addEventListener("focusin",(function(){return t.wrapper&&t.wrapper.classList.add(t.classNames.hasFocus)})),e.addEventListener("focusout",(function(){return t.wrapper&&t.wrapper.classList.remove(t.classNames.hasFocus)}));var r=function(r){e.innerHTML=null!==r?void 0===r?t.invalidSign:r:""};return this.owner&&this.unsubscribers.push(this.owner.on("valueChanged",r)),this.owner&&r(this.owner.value||null),e},e}(i.NumericDomBuilder);e.CalcDomBuilder=u}]);