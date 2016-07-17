"use strict";
const routeController = require("../../views/routeController.jsx");
const ReactRouterMatch = require("react-router").match;
const RouterContext = require("react-router").RouterContext;
const React = require("react");
const ReactDOM = require("react-dom/server");
const logger = require("log4js").getLogger("request.ReactFilter");

const cssPath = "/css/style.css";
const jsPath = "/scripts/react/app.js";

/**
 * React view middleware, used for Iso-Morphic support.
 *
 * Uses React Router, for routing requests.
 * Routes are defined in routeController.jsx.
 *
 * If no route is matched, renderProps is null, it then passes control to next middleware.
 *
 * @type {{initReactFilter: module.exports.initReactFilter}}
 */
module.exports = {
    initReactFilter: function (app) {
        app.filter("/*", function (req, res, next) {
            logger.debug("Got request....", req.url);
            ReactRouterMatch({
                routes: routeController,
                location: req.url
            }, function (error, redirectLocation, renderProps) {
                if (error) {
                    logger.debug("Error");
                    return res.status(500).send(error.message);
                } else if (redirectLocation) {
                    logger.debug("Redirecting");
                    return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
                } else if (renderProps) {
                    const content = ReactDOM.renderToString(<RouterContext {...renderProps}/>);
                    res.write(`<html>
                        <head>
                        <link rel="stylesheet" href="${cssPath}" type="text/css"/>
                        </head>
                        <body>
                        <div id="root">${content}</div>
                        <script type="text/javascript" src="${jsPath}"></script>
                        </body>
                        </html>`);
                    res.end();
                } else {
                    logger.debug("forwarding filter!!");
                    next();
                }
            });
        });
    }
};