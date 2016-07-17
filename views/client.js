var Router = require('react-router').Router;
var React = require('react');
var ReactDOM = require('react-dom');
var routes = require('./routeController.jsx');

var BrowserHistory = require('react-router').browserHistory;

window.onload = function () {
    ReactDOM.render(
        (<Router history={BrowserHistory} routes={routes}/>),
        document.getElementById("root")
    );
};