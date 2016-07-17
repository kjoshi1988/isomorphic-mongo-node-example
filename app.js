/**
 * @author kjoshi
 * @version $Id$*
 */

"use strict";
require("./lib/bin/prototype");
require('babel-register')({
    presets: ["react"],
    extensions: [".jsx"]
});
const configLoader = require("./lib/config/ConfigurationLoader");
const bootStrap = require("./lib/bootstrap");
const logger = require("log4js").getLogger("app");
const dataApi = require("./lib/api/dataApiFilter");
const reactFilter = require("./lib/request/ReactViewFilter.jsx");
const staticResourceHandler = require("./lib/request/StaticResourceHandler");


//loading globals
(function () {
    global.__rootDir = __dirname;
    global.Config = configLoader.load();
})();

const port = Config.getInt("app.http.port", 8080);
const app = bootStrap();

staticResourceHandler.init(app);
dataApi.initDataApi(app);
reactFilter.initReactFilter(app);

app.listen(port, function () {
    logger.debug("Server started on port:%s", port);
});



