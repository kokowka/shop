import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet'
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import axios from "axios";

let strings = new LocalizedStrings(localization);

class Contact extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        this.state = {
            isLoading: true
        };
        strings.setLanguage(language);
    }

    componentDidMount() {
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    sendMessage = (e) => {
        e.preventDefault();
        axios.post(`/sendEmail`, {
            subject: 'Contact',
            html: `${e.target[0].value}\n${e.target[1].value}\n${e.target[2].value}\n${e.target[3].value}`
        });
        setTimeout(
            () => {
                window.location.href = '/';
            },
            100
        );
    };

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <title>{strings.contact}</title>
                <link rel="stylesheet" type="text/css" href="assets/styles/contact_styles.css"/>
            </Helmet>
            <Header/>
            <div className="contact_form">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="contact_form_container">
                                <div className="contact_form_title">{strings.getInTouch}</div>

                                <form onSubmit={this.sendMessage} id="contact_form">
                                    <div
                                        className="contact_form_inputs d-flex flex-md-row flex-column justify-content-between align-items-between">
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder={strings.name}
                                               required="required" data-error="Name is required."/>
                                            <input type="text" id="contact_form_email"
                                                   className="contact_form_email input_field" placeholder={strings.email}
                                                   required="required" data-error="Email is required."/>
                                                <input type="text" id="contact_form_phone"
                                                       className="contact_form_phone input_field"
                                                       placeholder={strings.phone}/>
                                    </div>
                                    <div className="contact_form_text">
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="message" rows="4" placeholder={strings.message} required="required"
                                                  data-error="Please, write us a message."/>
                                    </div>
                                    <div className="contact_form_button">
                                        <button type="submit" className="button contact_submit_button">{strings.sendMessage}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel"/>
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

export default Contact;