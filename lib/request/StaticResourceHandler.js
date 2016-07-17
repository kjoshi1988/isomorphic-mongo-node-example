"use strict";
const fs = require("fs");
const path = require("path");
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const fileTypes = {
    "text/css": {type: "css", contentType: "text/css"},
    "text/javascript": {type: "js", contentType: "text/javascript"},
    "text/plain": {type: "plain", contentType: "text/plain"},
    "*/*": {type: "all"}
};
const crypto = require('crypto');

function resHandler(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return next();
    }
    let filePath = path.join(__rootDir, "public", req.uri);
    let type = findType(req.headers["accept"]);
    if (type) {
        let lastETag = req.headers["If-None-Match"];
        fs.lstat(filePath, function (err, stat) {
            if (err) {
                res.statusCode = 500;
                res.end();
            } else {
                let hash = crypto.createHash('md5').update(stat.mtime.getTime().toString()).digest("hex");
                if (hash === lastETag) {
                    res.status(304).end();
                } else {
                    fs.readFile(filePath, "utf-8", function (err, data) {
                        if (err) {
                            res.error(err);
                        } else {
                            res.setHeader('Cache-Control', 'public,max-age=' + MAX_AGE);
                            res.setHeader("Expires", new Date(Date.now() + (MAX_AGE * 1000)).toUTCString());
                            res.setHeader("Content-Type", getContentType(type, req.uri));
                            res.setHeader("ETag", hash);
                            res.write(data);
                            res.end();
                        }
                    });
                }
            }
        });
    } else {
        next();
    }
}

function findType(acceptHeader) {
    if (acceptHeader) {
        let list = acceptHeader.split(",");
        for (let i = 0; i < list.length; i++) {
            let type = fileTypes[list[i]];
            if (type) {
                return type;
            }
        }
    }
    return null;
}

function getContentType(type, url) {
    if (type.type === "all") {
        if (/\.js$/.test(url)) {
            return "text/javascript";
        }
        if (/\.css$/.test(url)) {
            return "text/css";
        }
        return "text/plain";
    }
    return type.contentType;
}

module.exports = {
    init: function (app) {
        app.filter("/scripts/*", resHandler);
        app.filter("/css/*", resHandler);
    }
};