/**
 * @author kjoshi
 * @version $Id$*
 *
 * Request handler for easy dispatching of request to controllers.
 * Uses same syntax as Express.
 *
 * Provides utility handlers like:
 * <pre>
 *     1. filter: used to bind middleware functions.
 *     2. get: bind a handler for GET request
 *     3. put: bind a handler for PUT request
 *     4. del: bind a handler for DELETE request
 *     5. post: bind a handler for POST request
 * </pre>
 *
 */
"use strict";
const http = require("http");
const UrlPattern = require("path-to-regexp");
const Enumerable = require("./biz/Enumerable");
const url = require("url");

const requestHandler = function (app) {
    /**
     * Finds next valid node.
     * It also provides a reference of next function to the handler.
     *
     * @param node
     * @param request
     * @param response
     * @returns {*}
     */
    function next(node, request, response) {
        let nextNode = getNextValidNode(node, request.url);
        if (nextNode) {
            return nextNode.callBack.call(app, request, response, next.bind(null, nextNode, request, response));
        }
        return checkForEndRouter(request, response);
    }

    /**
     * Matches handlers based on method and url.
     * Also extracts parameters from request,
     * for eg: if url pattern is "/test/:id",
     * then on successful pattern match,
     * a params map will be populated and  is
     * attached to the request object.
     *
     * @param request
     * @param response
     * @returns {*}
     */
    function checkForEndRouter(request, response) {
        let method = request.method || "get";
        if (method === "delete") {
            method = "del";
        }
        let handlers = app.__routeHandlers[method.toLowerCase()];
        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                let node = handlers[i];
                let match = node.urlPattern.exec(request.url);
                if (match !== null) {
                    if (node.urlPattern.keys && node.urlPattern.keys.length > 0) {
                        request.params = request.params || {};
                        node.urlPattern.keys.forEach(function (key, index) {
                            let value = match[index + 1];
                            if (value) {
                                request.params[key.name] = value;
                            }
                        });
                    }
                    return node.callBack.call(app, request, response);
                }
            }
        }
        return invalidUrl(request, response);
    }

    /**
     * Matches pattern of existing node with the url.
     *
     * @param currentNode
     * @param url
     * @returns {*}
     */
    function getNextValidNode(currentNode, url) {
        if (currentNode === null) {
            currentNode = app.__filterNodes.start();
        } else {
            currentNode = currentNode.nextNode;
        }
        if(currentNode) {
            if (currentNode.urlPattern.exec(url) !== null) {
                return currentNode;
            } else if(currentNode.nextNode) {
                return getNextValidNode(currentNode, url);
            }
        }
        return null;
    }

    /**
     * Invalid url handler, throws 404.
     *
     * @param req
     * @param resp
     * @returns {*}
     */
    function invalidUrl(req, resp) {
        resp.writeHead(404, {'Content-Type': 'text/plain'});
        return resp.end('Cannot GET:' + req.uri);
    }

    /**
     * Handler function, called for each request.
     * Attaches utility functions in response.
     */
    return function (req, resp) {
        req.uri = req.url && req.url.split("?")[0];
        resp.status = function (status) {
            resp.statusCode = status;
            return resp;
        };
        resp.send = function (data) {
            resp.write(data);
            resp.end();
            return resp;
        };
        resp.json = function (json) {
            resp.setHeader('content-type', 'application/json');
            resp.write(JSON.stringify(json));
            resp.end();
        };
        resp.error = function (err) {
            resp.writeHead(500, {'content-type': 'text/plain'});
            resp.write(err);
            resp.end();
        };
        resp.redirect = function (status, url) {
            let body = status + ". Redirecting to " + url;
            resp.writeHead(status, {
                'Location': url,
                'Content-Length': body.length,
                'Content-Type': 'text/plain' });
            resp.end(body);
        };
        return next(null, req, resp);
    };
};

/**
 * Linked list node.
 */
class Node {
    constructor(urlPattern, callBack) {
        this.nextNode = null;
        this.callBack = callBack;
        this.urlPattern = urlPattern;
    }
}

/**
 * Filter callback functions are stored as linked list
 *
 * @returns {{addNode: addNode, start: start}}
 */
const filterNodes = function () {
    let start;
    let end;
    return {
        addNode: function (urlPattern, callBack) {
            let node = new Node(urlPattern, callBack);
            if (!start) {
                start = end = node;
            } else {
                end.nextNode = node;
                end = node;
            }
        },
        start: function () {
            return start;
        }
    };
};

/**
 * Request handler provider.
 */
class Application extends Enumerable {
    constructor() {
        super();
        this.addNonModifiableProperty("__filterNodes", filterNodes());
        this.addNonModifiableProperty("__routeHandlers", {
            get: [],
            post: [],
            del: [],
            put: []
        });
    }



    /**
     * Middleware request handler.
     *
     * @param url
     * @param fn
     * @returns {Application}
     */
    filter(url, fn) {
        this.__filterNodes.addNode(new UrlPattern(url), fn);
        return this;
    }


    /**
     * GET request handler.
     *
     * @param url
     * @param fn
     * @returns {Application}
     */
    get(url, fn) {
        this.__routeHandlers.get.push(new Node(new UrlPattern(url), fn));
        return this;
    }

    /**
     * POST request handler.
     *
     * @param url
     * @param fn
     * @returns {Application}
     */
    post(url, fn) {
        this.__routeHandlers.post.push(new Node(new UrlPattern(url), fn));
        return this;
    }

    /**
     * PUT request handler.
     *
     * @param url
     * @param fn
     * @returns {Application}
     */
    put(url, fn) {
        this.__routeHandlers.put.push(new Node(new UrlPattern(url), fn));
        return this;
    }


    /**
     * DELETE request handler.
     *
     * @param url
     * @param fn
     * @returns {Application}
     */
    del(url, fn) {
        this.__routeHandlers.del.push(new Node(new UrlPattern(url), fn));
        return this;
    }

    /**
     * Bootstrap the http server.
     * Should be called only once.
     *
     * @param port
     * @param fn
     * @returns {Application}
     */
    listen(port, fn) {
        http.createServer(requestHandler(this)).listen(port, fn || function () {
            });
        return this;
    }
}

/**
 * @returns {Application}
 */
module.exports = function () {
    let app = new Application();
    requestHandler(app);
    return app;
};