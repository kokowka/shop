import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isErrorEmail: false,
            isErrorPassword: false,
            isErrorPhone: false
        }
    }

    register = (e) => {
        e.preventDefault();
        this.setState({
            isErrorEmail: false,
            isErrorPassword: false,
            isErrorPhone: false
        });
        if(e.target[4].value !== e.target[5].value || e.target[4].value.length < 6)
            this.setState({isErrorPassword: true});
        else if(e.target[3].value.length < 8)
            this.setState({isErrorPhone: true});
        else if(!e.target[1].value.includes('@')){
            this.setState({isErrorEmail: true});
        }
        else {
            axios.post(`/register`, {
                fullName: e.target[0].value,
                email: e.target[1].value,
                phone: `${e.target[2].value}${e.target[3].value}`,
                password: e.target[4].value
            }).then(res => window.location.href = '/singIn')
                .catch(error => {
                    this.setState({isErrorEmail: true});
                });
        }
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
                    <form onSubmit={this.register}>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-user"/> </span>
                            </div>
                            <input name="" className="form-control" placeholder="Full name" type="text"/>
                        </div>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-envelope"/> </span>
                            </div>
                            <input name="" className={`form-control${this.state.isErrorEmail ? ' error': ''}`} placeholder="Email address" type="email"/>
                        </div>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-phone"/> </span>
                            </div>
                            <select className="custom-select">
                                <option select="">+380</option>
                                <option value="1">+7</option>
                                <option value="2">+48</option>
                            </select>
                            <input name="" className={`form-control${this.state.isErrorPhone ? ' error': ''}`} placeholder="Phone number" type="text"/>
                        </div>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-lock"/> </span>
                            </div>
                            <input className={`form-control${this.state.isErrorPassword ? ' error': ''}`} placeholder="Create password" type="password"/>
                        </div>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-lock"/> </span>
                            </div>
                            <input className={`form-control${this.state.isErrorPassword ? ' error': ''}`} placeholder="Repeat password" type="password"/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Create Account</button>
                        </div>
                        <p className="text-center">Have an account? <a href={"/singIn"}>Log In</a></p>
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

export default Register;