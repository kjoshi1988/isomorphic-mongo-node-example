"use strict";
const Route = require('react-router').Route;
const React = require('react');
const Layout = require('./components/layout.jsx');
const EmpList = require('./components/employee/employeeList.jsx');
const ProjectList = require('./components/project/projectList.jsx');
const Project = require('./components/project/project.jsx');

/**
 * Routes for handling views.
 *
 * @type {XML}
 */
const routes = (
    <Route name='home' path="/" component={Layout}>
        <Route name="employeeList" path="/employees" component={EmpList} />
        <Route name="projectList" path="/projects" component={ProjectList} />
        <Route name="project" path="/projects/:projId" component={Project} />
    </Route>
);

module.exports = routes;