/**
 * @author kjoshi
 * @version $Id$*
 *
 * Application Entry point.
 * For route handling, it uses bootStrap, which is written locally and works similar to express.
 * It also uses react router for view rendering.
 *
 */

"use strict";
require("./lib/bin/prototype");
require('babel-register')({
    presets: ["react"],
    extensions: [".jsx"]
});
/**
 * Basic imports
 */
const configLoader = require("./lib/config/ConfigurationLoader");
const bootStrap = require("./lib/bootstrap");
const logger = require("log4js").getLogger("app");
const dataApi = require("./lib/api/dataApiFilter");
const reactFilter = require("./lib/request/ReactViewFilter.jsx");
const staticResourceHandler = require("./lib/request/StaticResourceHandler");


//loading globals
(function () {
    global.__rootDir = __dirname;
    /**
     * loading configurations from config/instance.properties file.
     */
    global.Config = configLoader.load();
})();

/**
 * Server port.
 * @type {Number}
 */
const port = Config.getInt("app.http.port", 8080);
/**
 * Creating reference for application loader.
 */
const app = bootStrap();

/**
 * Adding handler for static resources like css and javascript.
 */
staticResourceHandler.init(app);
/**
 * Adding handler for requests trying to fetch data as json
 * for eg:
 * <pre>
 *      1./api/users/all : returns all employees.
 *      2./api/projects/all : returns all projects.
 *      3./api/project/:projId : returns project info for <projId>.
 * </pre>.
 */
dataApi.initDataApi(app);
/**
 * React view middleware.
 */
reactFilter.initReactFilter(app);
/**
 * Starting up server.
 */
app.listen(port, function () {
    logger.debug("Server started on port:%s", port);
});



