import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import { CompactPicker } from 'react-color';
import ImageUploader from 'react-images-upload';

let strings = new LocalizedStrings(localization);

class AddGoods extends Component{
    constructor(props){
        super(props);
        const language = localStorage.getItem('language');
        strings.setLanguage(language);
        axios.post('http://localhost:3001/isAdmin',{
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName')
        }).then(res => {
            if(!res.data.isAdmin) window.location.href = '/';
        }).catch(error => window.location.href = '/');
        this.onDrop = this.onDrop.bind(this);
        this.state = {
            color: '#000000',
            pictures: [],
            urls: [],
            colors: []
        }
    }

    handleColorChange = (color) => {
        this.setState({ color: color.hex, colors: this.state.colors.concat(color.hex) });
    };

    onDrop(picture) {
        this.setState({pictures: picture});
    }

    uploadImg = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        let pictures = this.state.pictures;
        for(let i = 0 ; i<pictures.length; i++) {
            fd.append(pictures[i].name, pictures[i]);
            await axios.post('https://us-central1-bazarshop-1490207444887.cloudfunctions.net/uploadFile', fd)
                .then(res => {this.setState({
                    urls: this.state.urls.concat(res.data.url),
                }); console.log(res.data.url)}).catch(error => console.log(error));
            }
    };

    addGoods = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:3001/goods/create', {
            name: e.target[0].value,
            brand: e.target[1].value,
            colors: this.state.colors,
            category: e.target[6].value,
            price: e.target[7].value,
            'description-en': e.target[11].value,
            'description-ru': e.target[12].value,
            'description-ua': e.target[13].value,
            imgs: this.state.urls
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
                                <div className="contact_form_title">Add</div>

                                <form onSubmit={this.addGoods} id="contact_form">
                                    <div
                                        className="contact_form_inputs d-flex flex-md-row flex-column justify-content-between align-items-between">
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Name"
                                               required="required" data-error="Name is required."/>
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Brand"
                                               required="required" data-error="Brand is required."/>
                                        <CompactPicker color={ this.state.color }
                                                       onChangeComplete={ this.handleColorChange }/>
                                        <select className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                            <option select="categories">{strings.categories}</option>
                                            <option value="computerAndLaptops">{strings.computerAndLaptops}</option>
                                            <option value="cameras">{strings.cameras}</option>
                                            <option value="phones">{strings.phones}</option>
                                            <option value="tv">{strings.tv}</option>
                                            <option value="gadgets">{strings.gadgets}</option>
                                            <option value="electronics">{strings.electronics}</option>
                                            <option value="consoles">{strings.consoles}</option>
                                            <option value="accessories">{strings.accessories}</option>
                                        </select>
                                    </div>
                                    <div className="contact_form_text">
                                        <input type="number" step="0.01" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Price"
                                               required="required" data-error="Price is required."/>
                                        <ImageUploader
                                            withIcon={true}
                                            buttonText='Choose images'
                                            onChange={this.onDrop}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={5242880}
                                        />
                                        <button onClick={this.uploadImg} className="button contact_submit_button">Upload images</button>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-eng" rows="4" placeholder="Description" required="required"
                                                  data-error="Please, write us a message."/>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-ru" rows="4" placeholder="Описание" required="required"
                                                  data-error="Please, write us a message."/>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-ua" rows="4" placeholder="Опис" required="required"
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

export default AddGoods;