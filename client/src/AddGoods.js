import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import ImageUploader from 'react-images-upload';

let strings = new LocalizedStrings(localization);

class AddGoods extends Component{
    constructor(props){
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        axios.post(`/isAdmin`,{
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName')
        }).then(res => {
            if(!res.data.isAdmin) window.location.href = '/';
        }).catch(error => window.location.href = '/');
        this.onDrop = this.onDrop.bind(this);
        this.state = {
            pictures: [],
            urls: [],
            categories: strings.category,
            category: 'allCategories'
        }
    }

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
        const subcategoryRu = document.getElementById('subcategory-ru').value;
        const subcategoryUa = document.getElementById('subcategory-ua').value;
        const getCharacteristicRuById = document.getElementById('characteristicRu').value.split('\n');
        const getCharacteristicUaById = document.getElementById('characteristicUa').value.split('\n');
        const characteristicsRu = {};
        const characteristicsUa = {};
        for(let i = 0; i<getCharacteristicUaById.length; i+=2){
            characteristicsRu[getCharacteristicRuById[i]] = getCharacteristicRuById[i + 1];
            characteristicsUa[getCharacteristicUaById[i]] = getCharacteristicUaById[i + 1];
        }

        axios.post(`/goods/create`, {
            name: e.target[0].value,
            brand: e.target[1].value,
            category: e.target[6].value,
            price: e.target[7].value,
            'description-ru': e.target[11].value,
            'description-ua': e.target[12].value,
            imgs: this.state.urls,
            'characteristics-ru': characteristicsRu,
            'characteristics-ua': characteristicsUa,
            'subcategory-ru': subcategoryRu,
            'subcategory-ua': subcategoryUa
        }).then(res => {
            this.state.imageUploader.state.pictures = [];
            this.state.imageUploader.state.files = [];
            this.setState({
                pictures: [],
                urls: [],
                colors: []
        }); console.log('Added one Good', res)})
            .catch(error => console.log(error))
    };

    setCategory = (e) => {
        this.setState({category: e.target.value})
    };

    render() {
        return <div className="super_container">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/contact_styles.css"/>
                <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet"/>
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
                                        <input type="text" className="contact_form_name input_field" placeholder="Name"
                                               required="required" data-error="Name is required."/>
                                        <input type="text" className="contact_form_name input_field" placeholder="Brand"
                                               required="required" data-error="Brand is required."/>
                                        <select onChange={this.setCategory} className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                            {
                                                Object.keys(this.state.categories).map((keyName, i) => {
                                                    return <option key={i} value={keyName}>{this.state.categories[keyName]}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="contact_form_text">
                                        <input type="number" step="0.01" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Price"
                                               required="required" data-error="Price is required."/>
                                        <ImageUploader ref={c => this.state.imageUploader = c}
                                            withIcon={true}
                                            buttonText='Choose images'
                                            onChange={this.onDrop}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={5242880}
                                        />
                                        <button onClick={this.uploadImg} className="button contact_submit_button">Upload images</button>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-ru" rows="4" placeholder="Описание" required="required"
                                                  data-error="Please, write us a message."/>
                                        <textarea id="contact_form_message" className="text_field contact_form_message"
                                                  name="description-ua" rows="4" placeholder="Опис" required="required"
                                                  data-error="Please, write us a message."/>
                                        <h3>Характеристика(Ru)</h3>
                                        <textarea id="characteristicRu" className="text_field contact_form_message"
                                                  name="characteristicRu" rows="4" placeholder="Характеристика" required="required"
                                                  data-error="Please, write us a message."/>

                                        <h3>Характеристика</h3>
                                        <textarea id="characteristicUa" className="text_field contact_form_message"
                                                  name="characteristicUa" rows="4" placeholder="Характеристика" required="required"
                                                  data-error="Please, write us a message."/>
                                    </div>
                                    <input id={'subcategory-ru'} style={this.state.category === 'accessoriesComputer' || this.state.category === 'sale' ? {}: {display: 'none'}} type="text" className="contact_form_name input_field" placeholder="Подкатегории"/>
                                    <input id={'subcategory-ua'} style={this.state.category === 'accessoriesComputer' || this.state.category === 'sale' ? {}: {display: 'none'}} type="text" className="contact_form_name input_field" placeholder="Підкатегорії"/>
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