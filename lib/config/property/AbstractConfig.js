/**
 * @author kjoshi
 * @version $Id$*
 */

"use strict";
const logger = require('log4js').getLogger("abstractConfig");
const _ = require("underscore");
const Enumerable = require("../../biz/Enumerable");

/**
 * Provides configuration utility functions.
 */
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

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     *
     * @param key
     * @param defaultValue
     * @returns {Object}
     */
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

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     * Returned value is converted to String.
     *
     * @param key
     * @param defaultValue
     * @returns {String}
     */
    getString(key, defaultValue){
        return this.get(key, defaultValue);
    }

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     * Returned value is converted to Number.
     *
     * @param key
     * @param defaultValue
     * @returns {Number}
     */
    getInt(key, defaultValue) {
        return parseInt(this.get(key, defaultValue));
    }

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     * Returned value is converted to Boolean.
     *
     * @param key
     * @param defaultValue
     * @returns {Boolean}
     */
    getBoolean(key, defaultValue) {
        let value = this.get(key, defaultValue);
        if (!(value instanceof Boolean) && typeof value === "string") {
            value = (value.trim() === "true");
        }
        return !!value;
    }

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     * Returned value is converted to Float.
     *
     * @param key
     * @param defaultValue
     * @returns {Number}
     */
    getFloat(key, defaultValue) {
        return parseFloat(this.get(key, defaultValue));
    }

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     * Value is returned as an array.
     *
     * @param key
     * @param defaultValue
     * @returns {Array}
     */
    getList(key, defaultValue) {
        let _value = this.__map[key];
        if (_value === undefined && defaultValue === undefined) {
            logger.warn("No property specified for {" + key + "}");
        }
        return _value !== undefined ? _value.split(",") : defaultValue;
    }

    /**
     * Fetches value for provided key in configuration file,
     * if not found default property is returned.
     * Value is returned as an string array.
     *
     * @param key
     * @param defaultValue
     * @returns {Array}
     */
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