import React, {Component} from "react";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import {Helmet} from "react-helmet";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import axios from "axios";
import {getUrlParam, getSignLanguage} from "./utils";

let strings = new LocalizedStrings(localization);

class InfoPage extends Component{
    constructor(props){
        super(props);
        const language = localStorage.getItem('language') || 'Українська' || 'Українська';
        this.state = {
            isLoading: true,
            language: language,
            info: {

            }
        }
    }

    componentDidMount() {
        const type = getUrlParam(window.location.href, 'type');
        axios.post(`/getInfo?type=${type}`)
            .then(result => {
                this.setState({info: result.data[0]})
            })
            .catch(error => console.log(error));
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/blog_single_styles.css"/>
            </Helmet>
            <Header/>
            <div className="single_post">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="single_post_title">{this.state.info ? this.state.info[`title-${getSignLanguage(this.state.language)}`]: ``}
                            </div>
                            <div className="single_post_text">
                                <p>{this.state.info ? this.state.info[`text-${getSignLanguage(this.state.language)}`]: ``}</p>
                            </div>
                        </div>
                    </div>
                </div>
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

export default InfoPage;