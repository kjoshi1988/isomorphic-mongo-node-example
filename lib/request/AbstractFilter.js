"use strict";

class AbstractFilter{
    init(app) {
        return app;
    }

    filter(req, resp, next) {
        return next(req, resp);
    }
}

module.exports = AbstractFilter;