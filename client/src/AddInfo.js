import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";

class AddInfo extends Component {
    constructor(props) {
        super(props);
        axios.post(`/isAdmin`,{
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName')
        }).then(res => {
            if (!res.data.isAdmin) window.location.href = '/';
        })

    }

    addInfo = (e) =>{
        e.preventDefault();
        axios.post(`/createInfo`, {
            'title-en': e.target[0].value,
            'title-ru': e.target[1].value,
            'title-ua': e.target[2].value,
            type: e.target[3].value,
            'text-en': e.target[4].value,
            'text-ru': e.target[5].value,
            'text-ua': e.target[6].value,
        }).then(res => window.location.href = '/')
            .catch(error => console.log(error))
    };

    render() {
        return <div className="super_container">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/contact_styles.css"/>
            </Helmet>
            <Header/>
            <div className="contact_form">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="contact_form_container">
                                <div className="contact_form_title">Add Info</div>

                                <form onSubmit={this.addInfo} id="contact_form">
                                    <div
                                        className="contact_form_inputs d-flex flex-md-row flex-column justify-content-between align-items-between">
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Title"
                                               required="required" data-error="Name is required."/>
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Заголовок(Рус)"
                                               required="required" data-error="Name is required."/>
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Заголовок"
                                               required="required" data-error="Name is required."/>
                                        <select className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                            <option value="pay">Доставка/Оплата</option>
                                            <option value="guarantee">Гарантія</option>
                                            <option value="сollaboration">Співпраця</option>
                                            <option value="about">Про нас</option>
                                        </select>
                                    </div>
                                    <div className="contact_form_text">

                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-eng" rows="4" placeholder="Text" required="required"
                                                  data-error="Please, write us a message."/>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-ru" rows="4" placeholder="Текст (Рус)" required="required"
                                                  data-error="Please, write us a message."/>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-ua" rows="4" placeholder="Текст" required="required"
                                                  data-error="Please, write us a message."/>
                                    </div>
                                    <div className="contact_form_button">
                                        <button type="submit" className="button contact_submit_button">Add
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
        </div>
    }
}

export default AddInfo;