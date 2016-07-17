"use strict";
const React = require("react");

const Header = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    loadView: function (id, e) {
        e.preventDefault();
        this.context.router.push(`/${id}`);
    },
    render: function () {
        return <div className="header grad-vert-blue">
            <div className="headerLeft">
                <a className="logo" href="/" onClick={this.loadView.bind(this, "")}>
                    ERM Module
                </a>
            </div>
        </div>
    }
});

module.exports = Header;