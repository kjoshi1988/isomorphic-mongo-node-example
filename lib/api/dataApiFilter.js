"use strict";
const DataLoader = require("./dataApiLoader");

module.exports = {
    initDataApi: function (app) {
        app.get("/api/users/all", function (req, res) {
            DataLoader.fetchAllEmployees(function (err, data) {
                if (err) {
                    return res.error(err)
                }
                return res.json(data);
            });
        });
        app.get("/api/projects/all", function (req, res) {
            DataLoader.fetchAllProjects(function (err, data) {
                if (err) {
                    return res.error(err)
                }
                return res.json(data);
            });
        });
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