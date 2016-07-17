"use strict";
let dbPool;
const ConnManager = require("../db/ConnManager");
const PromiseApi = require("../util/promiseApi");
const ObjectID = require('mongodb').ObjectID;

function getDbPool() {
    if (!dbPool) {
        dbPool = ConnManager.init(Config.getString("app.mongo.db.url", "mongodb://127.0.0.1:27017"), Config.getString("app.mongo.db.name", "test"));
    }
    return dbPool;
}

const DataAPI = {};

DataAPI.fetchAllEmployees = function (callBack) {
    let dbPool = getDbPool(), defer = Promise.defer();
    dbPool.acquire(function (err, dbConn) {
        if (err) {
            return doPromiseCallBack(defer, callBack, err);
        }
        dbConn.collection('employees').find({}, function (err, docs) {
            // do something
            if (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            }
            PromiseApi.iterateDocs(docs)
                .then(function (data) {
                    doPromiseCallBack(defer, callBack, err, data);
                    return dbPool.release(dbConn);
                }).catch(function (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            });
        });
    });
    return defer.promise;
};
DataAPI.fetchAllProjects = function (callBack) {
    let dbPool = getDbPool(), defer = Promise.defer();
    dbPool.acquire(function (err, dbConn) {
        if (err) {
            return doPromiseCallBack(defer, callBack, err);
        }
        dbConn.collection('projects').find({}, function (err, docs) {
            // do something
            if (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            }
            PromiseApi.iterateDocs(docs)
                .then(function (data) {
                    doPromiseCallBack(defer, callBack, err, data);
                    return dbPool.release(dbConn);
                }).catch(function (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            });
        });
    });
    return defer.promise;
};
DataAPI.fetchProjectById = function (projId, callBack) {
    let dbPool = getDbPool(), defer = Promise.defer();
    dbPool.acquire(function (err, dbConn) {
        if (err) {
            return doPromiseCallBack(defer, callBack, err);
        }
        dbConn.collection('projects').find({"_id": new ObjectID(projId)}, function (err, doc) {
            // do something
            if (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            }
            PromiseApi.iterateDocs(doc)
                .then(function (data) {
                    let mngr = data[projId].manager;
                    promisifyAll({
                        "members": DataAPI.fetchEmployeesByMngr(mngr),
                        "manager": DataAPI.fetchEmployeeById(mngr)
                    }).then(function (projectData) {
                        data[projId].members = projectData.members;
                        data[projId].manager = projectData.manager[mngr];
                        doPromiseCallBack(defer, callBack, null, data);
                        return dbPool.release(dbConn);
                    }).catch(function (err) {
                        doPromiseCallBack(defer, callBack, err);
                        return dbPool.release(dbConn);
                    });
                })
                .catch(function (err) {
                    doPromiseCallBack(defer, callBack, err);
                    return dbPool.release(dbConn);
                });
        });
    });
    return defer.promise;
};
DataAPI.fetchEmployeeById = function (empId, callBack) {
    let dbPool = getDbPool(), defer = Promise.defer();
    dbPool.acquire(function (err, dbConn) {
        if (err) {
            return doPromiseCallBack(defer, callBack, err);
        }
        dbConn.collection('employees').find({"_id": new ObjectID(empId)}, function (err, doc) {
            // do something
            if (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            }
            PromiseApi.iterateDocs(doc)
                .then(function (data) {
                    doPromiseCallBack(defer, callBack, err, data);
                    return dbPool.release(dbConn);
                }).catch(function (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            });
        });
    });
    return defer.promise;
};
DataAPI.fetchEmployeesByMngr = function (mngrId, callBack) {
    let dbPool = getDbPool(), defer = Promise.defer();
    dbPool.acquire(function (err, dbConn) {
        if (err) {
            return doPromiseCallBack(defer, callBack, err);
        }
        dbConn.collection('employees').find({"managers": mngrId}, function (err, doc) {
            // do something
            if (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            }
            PromiseApi.iterateDocs(doc)
                .then(function (data) {
                    doPromiseCallBack(defer, callBack, err, data);
                    return dbPool.release(dbConn);
                }).catch(function (err) {
                doPromiseCallBack(defer, callBack, err);
                return dbPool.release(dbConn);
            });
        });
    });
    return defer.promise;
};

function doPromiseCallBack(promise, cb, err, data) {
    if (err) {
        cb && cb(err);
        promise.reject(err);
    } else {
        cb && cb(null, data);
        promise.resolve(data);
    }
}
module.exports = DataAPI;