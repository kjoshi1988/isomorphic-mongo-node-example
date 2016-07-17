/**
 * @author kjoshi
 * @version $Id$*
 */
"use strict";
const properties = require("properties");
const fs = require("fs");
const path = require("path");
const AbstractConfig = require("./property/AbstractConfig");

const instancePath = "config/instance.properties";
/**
 * Loads properties from provided path.
 * Creates an object of AbstractConfig.
 *
 * @param filePath
 */
module.exports = {
    load: function () {
        var contents = fs.readFileSync(path.join(__rootDir, instancePath));
        return new AbstractConfig(properties.parse(contents.toString()));
    }
};