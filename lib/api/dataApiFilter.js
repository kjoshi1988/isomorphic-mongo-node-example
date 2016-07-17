"use strict";
const DataLoader = require("./dataApiLoader");

/**
 * Data handlers, based on request uri(RESTful api patterns).
 *
 * @type {{initDataApi: module.exports.initDataApi}}
 */
module.exports = {
    initDataApi: function (app) {
        /**
         * Fetches all employees.
         */
        app.get("/api/users/all", function (req, res) {
            DataLoader.fetchAllEmployees(function (err, data) {
                if (err) {
                    return res.error(err)
                }
                return res.json(data);
            });
        });
        /**
         * Fetches all projects.
         */
        app.get("/api/projects/all", function (req, res) {
            DataLoader.fetchAllProjects(function (err, data) {
                if (err) {
                    return res.error(err)
                }
                return res.json(data);
            });
        });
        /**
         * Fetches project based on projId.
         */
        app.get("/api/project/:projId", function (req, res) {
            DataLoader.fetchProjectById(req.params.projId, function (err, data) {
                if (err) {
                    return res.error(err)
                }
                return res.json(data);
            });
        });
    }
};