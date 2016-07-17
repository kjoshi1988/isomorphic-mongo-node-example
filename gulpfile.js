"use strict";

const gulp = require("gulp");
const fs = require("fs");
const mkdirs = require('mkdirs');
const exec = require('child_process').exec;
const logger = require("log4js").getLogger("gulpfile");
const runSequence = require('run-sequence');
const async = require("async");
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const reactify = require('reactify');

const packageJSON = require('./package.json');
const mongoDbUrl = packageJSON.path.mongoDB;

function runCommand(command) {
    return function (cb) {
        exec(command, function (err, stdout, stderr) {
            if (err) {
                logger.warn("Error running task:", command);
                return cb();
            }
            cb();
        });
    }
}

gulp.task('start-mongo', function (cb) {
    mkdirs("logs");
    mkdirs("data");
    return runCommand('mongod --fork --dbpath ./data/ --logpath logs/mongo.log')(cb);
});
gulp.task('stop-mongo', runCommand('mongo admin --eval "db.shutdownServer();"'));

gulp.task('setup-db', function (cb) {
    logger.debug("Setting up mongo, please ensure mongo db is locally installed");
    runSequence("start-mongo", function () {
        MongoClient.connect(mongoDbUrl, {}, function (err, dbConn) {
            if (err) {
                //logger.error(err);
                return cb(err, dbConn);
            }
            logger.debug("Connected to server.");
            let employees = dbConn.collection("employees");
            let projects = dbConn.collection("projects");

            async.parallel([
                function (cb) {
                    employees.deleteMany({}, cb);
                },
                function (cb) {
                    projects.deleteMany({}, cb);
                },
                function (cb) {
                    employees.createIndex({"managers": 1, "designation": 1}, cb);
                },
                function (cb) {
                    projects.createIndex({"managers": 1}, cb);
                }
            ], function () {
                dbConn.close(function () {
                    runSequence("build-metadata");
                });
            });
        });
    });
});
gulp.task("build-metadata", ["build-emp-metadata", "build-project-metadata"]);
gulp.task("build-emp-metadata", function () {
    const mongodbData = require('gulp-mongodb-data');
    return gulp.src('./schema/employee.json')
        .pipe(mongodbData({
            mongoUrl: mongoDbUrl,
            collectionName: 'employees'
        }));
});
gulp.task("build-project-metadata", function () {
    const mongodbData = require('gulp-mongodb-data');
    return gulp.src('./schema/project.json')
        .pipe(mongodbData({
            mongoUrl: mongoDbUrl,
            collectionName: 'projects'
        }));
});

gulp.task('bundle', function () {
    return browserify(packageJSON.path.app)
        .transform('reactify', {stripTypes: true, es6: true})
        .bundle()
        .pipe(source(packageJSON.dest.app))
        .pipe(gulp.dest(packageJSON.dest.dist));
});

gulp.task("watch", function(){
    gulp.watch('views/client.js', ['bundle']);
    gulp.watch('views/**/*.jsx', ['bundle']);
});