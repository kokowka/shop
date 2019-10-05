import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import axios from 'axios';

class SingIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isErrorEmail: false,
            isErrorPassword: false,
        }
    }

    singIn = (e) => {
        e.preventDefault();
        this.setState({
            isErrorEmail: false,
            isErrorPassword: false
        });
        axios.post(`${process.env.REACT_APP_API_URL}/login`, {
            email: e.target[0].value,
            password: e.target[1].value
        }).then(res => {
            localStorage.setItem('fullName', res.data.fullName);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('phone', res.data.phone);
            window.location.href = '/';
        }).catch(error => this.setState({
            isErrorEmail: true,
            isErrorPassword: true,
        }));
    };

    render() {
        return <div className="super_container">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/contact_styles.css"/>
                <link rel="stylesheet" type="text/css" href="assets/styles/register.css"/>
            </Helmet>
            <Header/>
            <div className="card bg-light">
                <article className="card-body mx-auto">
                    <form onSubmit={this.singIn}>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-envelope"/> </span>
                            </div>
                            <input name="" className={`form-control${this.state.isErrorEmail ? ' error': ''}`} placeholder="Email address" type="email"/>
                        </div>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-lock"/> </span>
                            </div>
                            <input className={`form-control${this.state.isErrorPassword ? ' error': ''}`} placeholder="Create password" type="password"/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Log In</button>
                        </div>
                    </form>
                </article>
            </div>
            <Footer/>
            <div className="copyright">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div
                                className="copyright_container d-flex flex-sm-row flex-column align-items-center justify-content-start">
                                <div className="copyright_content">
                                    Copyright &copy;
                                    All rights reserved {new Date().getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SingIn;