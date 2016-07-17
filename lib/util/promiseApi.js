"use strict";
const logger = require("log4js").getLogger("util.promiseApi");

function promisifyAllFn() {
    return function (promiseList) {
        let retPromise = Promise.defer();
        let retArr, errArr = [];
        if (typeof promiseList === "object") {
            if (Array.isArray(promiseList)) {
                let count = promiseList.length;
                retArr = [];
                if (promiseList.length === 0) {
                    checkIfPromised(0, retPromise, retArr, errArr);
                } else {
                    promiseList.forEach(function (promise, index) {
                        if (promise && promise.isPromiseObj()) {
                            promise.then(function (ret) {
                                retArr[index] = ret;
                                count--;
                                checkIfPromised(count, retPromise, retArr, errArr);
                            }).catch(function (err) {
                                errArr[index] = err;
                                count--;
                                checkIfPromised(count, retPromise, retArr, errArr);
                            });
                        } else {
                            retArr[index] = promise;
                            count--;
                            checkIfPromised(count, retPromise, retArr, errArr);
                        }
                    });
                }
            } else {
                retArr = {};
                let count = Object.keys(promiseList).length;
                if (count === 0) {
                    checkIfPromised(count, retPromise, retArr, errArr);
                } else {
                    promiseList.forEachMap(function (key, promise) {
                        if (promise && promise.isPromiseObj()) {
                            promise.then(function (ret) {
                                retArr[key] = ret;
                                count--;
                                checkIfPromised(count, retPromise, retArr, errArr);
                            }).catch(function (err) {
                                errArr.push(err);
                                count--;
                                checkIfPromised(count, retPromise, retArr, errArr);
                            });
                        } else {
                            count--;
                            retArr[key] = promise;
                            checkIfPromised(count, retPromise, retArr, errArr);
                        }
                    });
                }
            }
        } else {
            logger.warn("Invalid promises passed!!");
            retPromise.resolve();
        }

        return retPromise.promise;
    };
}

function checkIfPromised(count, promise, retArr, errArr) {
    if (count === 0) {
        if (errArr && errArr.length > 0) {
            promise.reject(errArr);
        } else {
            promise.resolve(retArr);
        }
    }
}

global.promisifyAll = promisifyAllFn();

module.exports = {
    iterateDocs: function (docs) {
        let defer = Promise.defer();

        let promiseList = {};
        docs.each(function (err, doc) {
            if (err) {
                promiseList.error = Promise.reject(err);
            } else if (doc) {
                promiseList[doc._id] = Promise.resolve(doc);
            } else {
                promisifyAll(promiseList).then(defer.resolve).catch(defer.reject);
            }
        });

        return defer.promise;
    }
};