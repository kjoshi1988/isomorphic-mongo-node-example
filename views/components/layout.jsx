"use strict";
const React = require("react");
const Header = require("./header.jsx");
const Index = require("./index.jsx");

const Layout = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render: function () {
        return <div className="layout">
            <Header/>
            <Index/>
            {this.props.children}
        </div>
    }
});

module.exports = Layout;