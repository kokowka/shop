import React, {Component} from "react";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import {Helmet} from "react-helmet";
import axios from "axios";
import {getUrlParam, getSignLanguage} from "./utils";
import Interweave from "interweave";


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
        if(type === 'blog') {
            const id = getUrlParam(window.location.href, 'id');
            axios.post(`/getPostsById?id=${id}`)
                .then(result => {
                    this.setState({info: result.data[0]})
                })
                .catch(error => console.log(error));
        } else {
            axios.post(`/getInfo?type=${type}`)
                .then(result => {
                    this.setState({info: result.data.reverse()[0]})
                })
                .catch(error => console.log(error));
        }
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/blog_single_styles.css"/>
            </Helmet>
            <Header/>
            <div className="single_post" style={this.state.info && this.state.info.img ? {marginBottom: '300px'}: {}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="single_post_title">{this.state.info ? this.state.info[`title-${getSignLanguage(this.state.language)}`]: ``}
                            </div>
                            <img style={this.state.info && this.state.info.img ? {maxHeight: '300px', objectFit: 'contain'}: {}} src={this.state.info && this.state.info.img ? this.state.info.img : ''} alt=""/>
                            <div className="single_post_text">
                                <Interweave
                                    content= {this.state.info ? this.state.info[`text-${getSignLanguage(this.state.language)}`]: ``}/>
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