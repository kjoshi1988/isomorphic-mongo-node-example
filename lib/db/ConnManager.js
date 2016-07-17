"use strict";

const MongoClient = require('mongodb').MongoClient;
const GenericPool = require("generic-pool");
const logger = require("log4js").getLogger("db.ConnManager");

module.exports = {
    /**
     *
     * @param url
     * @param dbName
     * @param opts
     * @returns {GenericPool}
     */
    init: function (url, dbName, opts) {
        url = url + "/" + dbName;
        opts = opts || {};
        return GenericPool.Pool({
            name: "mongoPool",
            create: function (callBack) {
                MongoClient.connect(url, {}, function (err, dbConn) {
                    if (err) {
                        logger.error(err);
                        dbConn.__ended = true;
                        return callBack(err, dbConn);
                    }
                    logger.debug("Connected to mongo db.");
                    return callBack(null, dbConn);
                });
            },
            destroy: function (dbConn) {
                return dbConn.close();
            },
            validate: function (dbConn) {
                return !dbConn.__ended;
            },
            max: opts.max || 3,
            min: opts.min || 0,
            refreshIdle: opts.refreshIdle || true,
            reapIntervalMillis: opts.reapIntervalMillis || 1000,
            idleTimeoutMillis: opts.idleTimeoutMillis || 30000
        });
    }
};