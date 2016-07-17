"use strict";
const React = require("react");

const Employee = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render: function () {
        return <div id="employee" className="employee"></div>
    }
});

module.exports = Employee;