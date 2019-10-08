import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';

let strings = new LocalizedStrings(localization);

class UpdateGoods extends Component{
    constructor(props){
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        axios.post(`${process.env.REACT_APP_API_URL}/isAdmin`,{
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName')
        }).then(res => {
            if(!res.data.isAdmin) window.location.href = '/';
        }).catch(error => window.location.href = '/');
    }


    updateGoods = (e) =>{
        e.preventDefault();
        const updateOrDelete = e.target[1].value;
        const id = e.target[0].value;
        const discount = e.target[2].value || 0;
        const isNewGood = e.target[3].value;
        const isSuperPropose = e.target[4].value;
        const timerOfPropose = e.target[5].value || 0;
        const available = e.target[6].value || 0;
        const sold = e.target[7].value || 0;
        axios.put(`${process.env.REACT_APP_API_URL}/updateOrDeleteGood`, {
            updateOrDelete: updateOrDelete,
            id: id,
            discount: discount,
            isNewGood: isNewGood,
            isSuperPropose: isSuperPropose,
            timerOfPropose: timerOfPropose,
            available: available,
            sold: sold
        }).then(result => window.location.href = '/')
            .catch(error => console.log(error));
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
                                <div className="contact_form_title">Update</div>

                                <form onSubmit={this.updateGoods} id="contact_form">
                                    <div
                                        className="contact_form_inputs d-flex flex-md-row flex-column justify-content-between align-items-between">
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Id"
                                               required="required" data-error="Id is required."/>
                                        <select className="custom-select my-1 mr-sm-2">
                                            <option select="update">Update</option>
                                            <option value={"delete"}>Delete</option>
                                        </select>
                                    </div>
                                    <div className="contact_form_text">
                                        <input type="number" step="0.01" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Discount"/>
                                        <select className="custom-select my-1 mr-sm-2">
                                            <option value="true">IsNew</option>
                                            <option value="false">NotNew</option>
                                        </select>
                                    </div>
                                    <div style={{marginTop: '20px'}} className="contact_form_text">
                                        <select className="custom-select my-1 mr-sm-2">
                                            <option value="true">IsSuperPropose</option>
                                            <option value="false">NotSuperPropose</option>
                                        </select>
                                        <input type="number"
                                               className="contact_form_name input_field" placeholder="Timer"/>
                                        <input type="number"
                                               className="contact_form_name input_field" placeholder="Available"/>
                                        <input type="number"
                                               className="contact_form_name input_field" placeholder="Sold"/>
                                    </div>
                                    <div className="contact_form_button">
                                        <button type="submit" className="button contact_submit_button">Update
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

export default UpdateGoods;