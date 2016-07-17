/**
 * @author kjoshi
 * @version $Id$*
 */

"use strict";

/**
 * Provide functions to add enumerable, modifiable values.
 */
class Enumerable {

    /**
     * Adds a property that is non writable, non deletable and
     * non enumerable(property that wont be visible in for each loop)
     *
     * @param property
     * @param value
     */
    addNonModifiableProperty(property, value) {
        Enumerable.addNonModifiableProperty(this, property, value);
    }

    /**
     * Adds a property that is non writable
     *
     * @param property
     * @param value
     */
    addNonWritableProperty(property, value) {
        Enumerable.addNonWritableProperty(this, property, value);
    }

    /**
     * Adds a property that is non enumerable(property that wont be visible in for each loop)
     *
     * @param property
     * @param value
     */
    addNonEnumerableProperty(property, value) {
        Enumerable.addNonEnumerableProperty(this, property, value);
    }

    /**
     * Adds a property that is non deletable
     *
     * @param property
     * @param value
     */
    addNonDeletableProperty(property, value) {
        Enumerable.addNonDeletableProperty(this, property, value);
    }

    /**
     * Adds a deletable property.
     *
     * @param property
     * @param value
     */
    addDeletableOnlyProperty(property, value) {
        Enumerable.addDeletableOnlyProperty(this, property, value);
    }

    /**
     * Custom property handle to control modifiable behaviours.
     * <pre>
     *      option = {
     *          enumerable: false,
     *          configurable: false,
     *          writable: false,
     *      }
     * </pre>
     *
     * @param property
     * @param value
     * @param options
     */
    addCustomModifierProperty(property, value, options) {
        Enumerable.addCustomModifierProperty(this, property, value, options);
    }

    /**
     * Adds a enumerable only property.
     *
     * @param property
     * @param value
     */
    addEnumerableOnlyProperty(property, value) {
        Enumerable.addEnumerableOnlyProperty(this, property, value);
    }

    /**
     * Adds a property that is non writable, non deletable and
     * non enumerable(property that wont be visible in for each loop)
     *
     * @param obj
     * @param property
     * @param value
     */
    static addNonModifiableProperty(obj, property, value) {
        Object.defineProperty(obj, property, {
            value: value
        });
    }

    /**
     * Adds a property that is non writable
     *
     * @param obj
     * @param property
     * @param value
     */
    static addNonWritableProperty(obj, property, value) {
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            writable: false,
            value: value
        });
    }

    /**
     * Adds a property that is non enumerable(property that wont be visible in for each loop)
     *
     * @param obj
     * @param property
     * @param value
     */
    static addNonEnumerableProperty(obj, property, value) {
        Object.defineProperty(obj, property, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    }

    /**
     * Adds a property that is non deletable
     *
     * @param obj
     * @param property
     * @param value
     */
    static addNonDeletableProperty(obj, property, value) {
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: false,
            writable: true,
            value: value
        });
    }

    /**
     * Adds a enumerable only property.
     *
     * @param obj
     * @param property
     * @param value
     */
    static addEnumerableOnlyProperty(obj, property, value) {
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: false,
            writable: false,
            value: value
        });
    }

    /**
     * Adds a deletable property.
     *
     * @param obj
     * @param property
     * @param value
     */
    static addDeletableOnlyProperty(obj, property, value) {
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            writable: false,
            value: value
        });
    }

    /**
     * Custom property handle to control modifiable behaviours.
     * <pre>
     *      option = {
     *          enumerable: false,
     *          configurable: false,
     *          writable: false,
     *      }
     * </pre>
     *
     * @param obj
     * @param property
     * @param value
     * @param options
     */
    static addCustomModifierProperty(obj, property, value, options) {
        options = options || {};
        options.value = value;
        Object.defineProperty(obj, property, options);
    }
}

/**
 * @type {Enumerable}
 */
module.exports = Enumerable;