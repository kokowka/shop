import React, {Component} from "react";
import {Helmet} from "react-helmet";

class NotFound extends Component {
    render() {
        return <div className="wrap">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/notFound.css"/>
            </Helmet>
            <div className="logo">
                <img src="assets/images/404.png" alt=""/>
                <p><a href="/">Go back to Home</a></p>
            </div>
        </div>
    }
}

export default NotFound;