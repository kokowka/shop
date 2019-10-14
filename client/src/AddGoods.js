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
            color: '#000000',
            pictures: [],
            urls: [],
            colors: [],
            categories: strings.category,
            category: 'allCategories'
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
        const subcategoryRu = document.getElementById('subcategory-ru').value;
        const subcategoryUa = document.getElementById('subcategory-ua').value;
        const sizeOfCharacteristics = document.getElementById('characteristic-ru').children.length / 2;
        const characteristicsRu = {};
        const characteristicsUa = {};
        for(let i = 0; i<sizeOfCharacteristics; i++) {
            let key = document.getElementById('characteristic-ru').children[i * 2].value;
            let val = document.getElementById('characteristic-ru').children[i * 2 + 1].value;
            characteristicsRu[key] = val;
            key = document.getElementById('characteristic-ua').children[i * 2].value;
            val = document.getElementById('characteristic-ua').children[i * 2 + 1].value;
            characteristicsUa[key] = val;
        }
        axios.post(`/goods/create`, {
            name: e.target[0].value,
            brand: e.target[1].value,
            colors: this.state.colors,
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
            this.setState({
                pictures: [],
                urls: [],
                colors: []
        }); console.log('Added one Good', res)})
            .catch(error => console.log(error))
    };

    addCharacteristic= () => {
        const nodeKey1 = document.createElement('input');
        const nodeKey2 = document.createElement('input');
        const characteristicRu = document.getElementById('characteristic-ru');
        const characteristicUa = document.getElementById('characteristic-ua');
        nodeKey1.setAttribute('type', 'text');
        nodeKey1.setAttribute('class', 'contact_form_name input_field');
        nodeKey1.placeholder = 'Key';
        nodeKey2.setAttribute('type', 'text');
        nodeKey2.setAttribute('class', 'contact_form_name input_field');
        nodeKey2.placeholder = 'Key';
        characteristicRu.appendChild(nodeKey1);
        characteristicUa.appendChild(nodeKey2);
        const nodeValue1 = document.createElement('input');
        const nodeValue2 = document.createElement('input');
        nodeValue1.type = 'text';
        nodeValue1.className += 'contact_form_name input_field add_characteristic';
        nodeValue1.placeholder = 'Value';
        nodeValue2.type = 'text';
        nodeValue2.className += 'contact_form_name input_field add_characteristic';
        nodeValue2.placeholder = 'Value';
        characteristicRu.appendChild(nodeValue1);
        characteristicUa.appendChild(nodeValue2);
    };

    minusCharacteristic = () => {
        const characteristicRu = document.getElementById('characteristic-ru');
        const characteristicUa = document.getElementById('characteristic-ua');
        const length = characteristicRu.childNodes.length;
        if(length !==0) {
            characteristicRu.removeChild(characteristicRu.childNodes[length - 1]);
            characteristicRu.removeChild(characteristicRu.childNodes[length - 2]);
            characteristicUa.removeChild(characteristicUa.childNodes[length - 1]);
            characteristicUa.removeChild(characteristicUa.childNodes[length - 2]);
        }
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
                                        <CompactPicker color={ this.state.color }
                                                       onChangeComplete={ this.handleColorChange }/>
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
                                        <ImageUploader
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
                                        <div id={'characteristic-ru'}>
                                            <input type="text" className="contact_form_name input_field" placeholder="Key"/>
                                            <input type="text" className="contact_form_name input_field add_characteristic" placeholder="Value"/>
                                        </div>
                                        <span onClick={this.addCharacteristic} className="glyphicon glyphicon-plus" style={{marginLeft: '20px'}}/>
                                        <span onClick={this.minusCharacteristic} className="glyphicon glyphicon-minus" style={{marginLeft: '20px'}}/>

                                        <h3>Характеристика</h3>
                                        <div id={'characteristic-ua'}>
                                            <input type="text" className="contact_form_name input_field" placeholder="Key"/>
                                            <input type="text" className="contact_form_name input_field add_characteristic" placeholder="Value"/>
                                        </div>
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