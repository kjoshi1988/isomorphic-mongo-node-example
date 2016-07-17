"use strict";
const logger = require("log4js").getLogger("request.ReactDataFilter");

module.exports = {
    initReactDataFilter: function (app) {
        app.filter("/employees", function (req, res, next) {

        });
        app.filter("/projects", function (req, res, next) {

        });
    }
};