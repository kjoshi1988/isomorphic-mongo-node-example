"use strict";
const React = require("react");
const request = require("superagent");

const EmpList = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount: function () {
        let self = this;
        if (!self.state.fetched) {
            request.get('/api/users/all', function (err, data) {
                if (!err) {
                    self.setState({
                        empList: data.body,
                        fetched: true
                    });
                }
            });
        }
    },
    getManagers: function (mgrIds) {
        let retMgr = [], self = this;
        if (this.state.empList && mgrIds) {
            mgrIds.forEach(function (mgrId) {
                let mgr = self.state.empList[mgrId];
                if (mgr) {
                    retMgr.push(mgr.name);
                }
            });
        }
        return retMgr.join(",");
    },
    getInitialState: function () {
        return {
            empList: {}
        };
    },
    render: function () {
        var empList = [], index=0;
        for (let key in this.state.empList) {
            let emp = this.state.empList[key];
            empList.push(<div id={emp._id} className="row">
                <div id={"emp_" + index + "_col_0"} className="col col-4 name">{emp.name}</div>
                <div id={"emp_" + index + "_col_1"} className="col col-4 joiningDate">{emp.date_of_joining}</div>
                <div id={"emp_" + index + "_col_2"} className="col col-4 designation">{emp.designation}</div>
                <div id={"emp_" + index + "_col_3"} className="col col-4 managers">{this.getManagers(emp.managers)}</div>
            </div>);
            index++;
        }
        return <div id="employees" className="employeesList">
            <div id="tableHeader" className="table-header row grad-vert-gray">
                <div id="header_col_0" className="col col-4 name">Name</div>
                <div id="header_col_1" className="col col-4 joiningDate">DOJ</div>
                <div id="header_col_2" className="col col-4 designation">Designation</div>
                <div id="header_col_3" className="col col-4 managers">Managers</div>
            </div>
            {empList}
        </div>
    }
});

module.exports = EmpList;