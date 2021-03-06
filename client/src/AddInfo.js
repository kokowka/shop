import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class AddInfo extends Component {
    constructor(props) {
        super(props);
        axios.post(`/isAdmin`,{
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName')
        }).then(res => {
            if (!res.data.isAdmin) window.location.href = '/';
        });
    }

    componentDidMount() {
        ClassicEditor.create( document.querySelector( '#editRu' ), {toolbar: [ 'bold', 'italic'] } )
            .then( editor => {editor.setData('Ru'); this.setState({editorRu: editor})} )
            .catch( error => console.error( error ));
        ClassicEditor.create( document.querySelector( '#editUa' ), {toolbar: [ 'bold', 'italic'] } )
            .then( editor =>{editor.setData('Ua'); this.setState({editorUa: editor}) })
            .catch( error => console.error( error ));
    }

    addInfo = (e) =>{
        e.preventDefault();
        axios.post(`/createInfo`, {
            'title-ru': e.target[0].value,
            'title-ua': e.target[1].value,
            type: e.target[2].value,
            'text-ru': this.state.editorRu.getData(),
            'text-ua': this.state.editorUa.getData(),
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
                                               className="contact_form_name input_field" placeholder="Заголовок(Рус)"
                                               required="required" data-error="Title is required."/>
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Заголовок"
                                               required="required" data-error="Title is required."/>
                                        <select className="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                                            <option value="pay">Доставка/Оплата</option>
                                            <option value="guarantee">Гарантія</option>
                                            <option value="сollaboration">Співпраця</option>
                                            <option value="about">Про нас</option>
                                        </select>
                                    </div>
                                    <div className="contact_form_text">

                                        <div id="editRu"/>
                                        <div id="editUa"/>

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