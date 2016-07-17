"use strict";
const React = require("react");
const request = require("superagent");

const Project = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount: function () {
        let self = this;
        if (!self.state.fetched) {
            let projectId = this.props.params.projId;
            request.get('/api/project/' + projectId, function (err, data) {
                if (!err) {
                    self.setState({
                        project: data.body[projectId],
                        fetched: true
                    });
                }
            });
        }
    },
    getInitialState: function(){
        return {
            project: {}
        }
    },
    render: function () {
        let projectMembers = [];
        let members = this.state.project.members;
        if (members) {
            for (let key in members) {
                projectMembers.push(<div id={key} className="projectMember">{members[key].name}</div>)
            }
        }
        return <div id="project" className="project">
            <div id="projectTitle" className="grad-vert-gray">{this.state.project.name}</div>
            <div id="projectInfo">
                <div id="projectDetails">{this.state.project.details}</div>
                <div id="projectStartDate">Started on: {this.state.project.start_date}</div>
                <div id="projectManager">Manager: {this.state.project.manager && this.state.project.manager.name}</div>
            </div>
            <div id="projectMemberLabel">Project Members</div>
            <div id="projectMemberDetails">{projectMembers}</div>
        </div>
    }
});

module.exports = Project;