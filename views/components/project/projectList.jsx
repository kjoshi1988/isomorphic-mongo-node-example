"use strict";
const React = require("react");
const request = require("superagent");

const ProjectList = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount: function () {
        let self = this;
        if (!self.state.fetched) {
            request.get('/api/projects/all', function (err, data) {
                if (!err) {
                    self.setState({
                        projectList: data.body,
                        fetched: true
                    });
                }
            });
        }
    },
    getManagers: function (mgrIds) {
        let retMgr = [], self = this;
        if (this.state.projectList && mgrIds) {
            mgrIds.forEach(function (mgrId) {
                let mgr = self.state.projectList[mgrId];
                if (mgr) {
                    retMgr.push(mgr.name);
                }
            });
        }
        return retMgr.join(",");
    },
    showProject: function (project) {
        this.context.router.push(`/projects/${project}`);
    },
    getInitialState: function () {
        return {
            projectList: {}
        };
    },
    render: function () {
        let projectList = [], index = 0;
        for (let key in this.state.projectList) {
            let project = this.state.projectList[key];
            projectList.push(
                <div id={project._id} title="click to view project info" className="projectBox" onClick={this.showProject.bind(this,project._id)}>
                    {project.name}
                </div>
            );
            index++;
        }
        return <div id="projects" className="projectsList">
            {projectList}
        </div>
    }
});

module.exports = ProjectList;