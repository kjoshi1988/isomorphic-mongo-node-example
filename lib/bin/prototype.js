"use strict";
Object.defineProperty(String.prototype, "format", {
    value: function (fmtArray) {
        let _tmp = this + "";
        if (!(fmtArray instanceof Array)) {
            fmtArray = Array.prototype.slice.call(arguments);
        }
        fmtArray.forEach(function (val, index) {
            let regex = new RegExp("\\{" + index + "\\}", "ig");
            _tmp = _tmp.replace(regex, val);
        });
        return _tmp;
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(String.prototype, "replaceAll", {
    value: function (searchValue, replaceValue) {
        if (searchValue instanceof RegExp) {
            searchValue = new RegExp(searchValue.source.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g");
        } else {
            searchValue = new RegExp(searchValue.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g");
        }
        return this.replace(searchValue, replaceValue);
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(String.prototype, "contains", {
    value: function (value) {
        return this.indexOf(value) !== -1;
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(Object.prototype, 'forEachMap', {
    value: function (callback) {
        let shouldBreak;
        let breakFn = function () {
            shouldBreak = true;
        };
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                callback.call(this, key, this[key], breakFn);
            }
            if (shouldBreak) {
                return;
            }
        }
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(Array.prototype, "forEachBreak", {
    value: function (fn) {
        let shouldBreak;
        let breakFn = function () {
            shouldBreak = true;
        };
        for (let index = 0; index < this.length; index++) {
            fn.call(this, this[index], index, breakFn);
            if (shouldBreak) {
                return;
            }
        }
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(JSON, 'safeStringify', {
    value: function (obj) {
        return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(Object.prototype, 'isPromiseObj', {
    value: function () {
        return ( typeof this === "object" && this !== null && this.then instanceof Function && this.catch instanceof Function);
    },
    enumerable: false,
    writable: true
});
Object.defineProperty(Object.prototype, 'extendFrom', {
    value: function (extendObj, parser) {
        let self = this;
        parser = parser || function (val) { return val || "";};
        extendObj.forEachMap(function(name, value){
            if (value) {
                self[name] = parser(value) || self[name];
            }
        });
        return self;
    },
    enumerable: false,
    writable: true
});

module.exports = {};