/**
 * @author kjoshi
 * @version $Id$*
 *
 * Api to connect with the data base.
 * Uses connManager for pooling connections.
 *
 * MongoDb has two collection, employee and project.
 *
 * Employee schema:
 *      {
 *          _id: <unique_emp_id>,
 *          name: <name of the employee>,
 *          date_of_joining: <employee's joining date>,
 *          designation: <employee's designation>,
 *          managers: [<references of _id of managers>]
 *      }
 *
 *  Project schema:
 *      {
 *          _id: <project_id>,
 *          name: <name of project>,
 *          details: <project details>,
 *          manager: <project manager's emp._id>,
 *          close_date: <project end date>,
 *          start_date: <date when project started>
 *      }
 *
 */

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

/**
 * Fetches all employees from database.
 *
 * @param callBack
 * @returns {*}
 */
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

/**
 * Fetches all projects in database.
 *
 * @param callBack
 * @returns {*}
 */
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

/**
 * Fetches the project by id.
 * It also fetches member details, using manager id,
 * i.e. all employees that are working under the "mgr_id".
 *
 * @param projId
 * @param callBack
 * @returns {*}
 */
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
/**
 * Fetch employee details.
 *
 * @param empId
 * @param callBack
 * @returns {*}
 */
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
/**
 * Fetch all the employees currently under the provided manager.
 *
 * @param mngrId
 * @param callBack
 * @returns {*}
 */
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