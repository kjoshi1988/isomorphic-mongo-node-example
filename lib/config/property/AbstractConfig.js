/**
 * @author kjoshi
 * @version $Id$*
 */

"use strict";
const logger = require('log4js').getLogger("abstractConfig");
const _ = require("underscore");
const Enumerable = require("../../biz/Enumerable");

class AbstractConfig {
    constructor(map) {
        Enumerable.addNonModifiableProperty(this, "__map", map || {});
    }

    getPropertyMap() {
        return this.__map;
    }

    getOriginalValueFromMap(key){
        let _value = this.__map[key];
        if (_value === undefined) {
            logger.warn("No property specified for {" + key + "}");
        }
        return _value;
    }

    get(key, defaultValue) {
        let _value = this.__map[key];
        if (_value === undefined && defaultValue === undefined) {
            logger.warn("No property specified for {" + key + "}");
        }
        if (typeof _value === "string") {
            _value = _value.replace(/\\,/g, "{COMMA}").split(",")[0].replace(/\{COMMA\}/g, ",");
        }
        return _value !== undefined ? _value : defaultValue;
    }

    getString(key, defaultValue){
        return this.get(key, defaultValue);
    }

    getInt(key, defaultValue) {
        return parseInt(this.get(key, defaultValue));
    }

    getLong(key, defaultValue) {
        return this.getInt(key, defaultValue);
    }

    getBoolean(key, defaultValue) {
        let value = this.get(key, defaultValue);
        if (!(value instanceof Boolean) && typeof value === "string") {
            value = (value.trim() === "true");
        }
        return !!value;
    }

    getFloat(key, defaultValue) {
        return parseFloat(this.get(key, defaultValue));
    }

    getList(key, defaultValue) {
        let _value = this.__map[key];
        if (_value === undefined && defaultValue === undefined) {
            logger.warn("No property specified for {" + key + "}");
        }
        return _value !== undefined ? _value.split(",") : defaultValue;
    }

    extend(propertyMap) {
        if (propertyMap instanceof AbstractConfig) {
            _(this.__map).extend(propertyMap.__map);
        } else {
            _(this.__map).extend(propertyMap);
        }
        return this;
    }

    getStringArray(key, defaultValue) {
        let list = this.getList(key, defaultValue);
        if (list && list.length > 0) {
            list.forEach(function (value, index) {
                list[index] = value && value.toString();
            });
        }
        return list;
    }
}

module.exports = AbstractConfig;