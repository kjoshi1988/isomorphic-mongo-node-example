"use strict";
const React = require("react");

const Index = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    showView: function (view) {
        this.context.router.push(`/${view}`);
    },
    render: function () {
        return <div className="indexView">
            <div id="viewEmployees" className="grad-vert-blue" onClick={this.showView.bind(null, "employees")}>View Employees Data</div>
            <div id="viewProjects" className="grad-vert-blue" onClick={this.showView.bind(null,"projects")}>View All Projects</div>
        </div>;
    }
});

module.exports = Index;