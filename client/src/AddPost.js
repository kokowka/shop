import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageUploader from "react-images-upload";

class AddPost extends Component{

    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            urls: []
        };
        axios.post(`/isAdmin`,{
            email: localStorage.getItem('email'),
            fullName: localStorage.getItem('fullName')
        }).then(res => {
            if (!res.data.isAdmin) window.location.href = '/';
        });
    }

    componentDidMount() {
        ClassicEditor.create( document.querySelector( '#editRu' ), {toolbar: [ 'bold', 'italic'] })
            .then( editor => {editor.setData('Ru'); this.setState({editorRu: editor})} )
            .catch( error => console.error( error ));
        ClassicEditor.create( document.querySelector( '#editUa' ), {toolbar: [ 'bold', 'italic'] } )
            .then( editor =>{editor.setData('Ua'); this.setState({editorUa: editor}) })
            .catch( error => console.error( error ));
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

    onDrop = (picture) => this.setState({pictures: picture});

    addPost = (e) =>{
        e.preventDefault();
        axios.post(`/createPost`, {
            'title-ru': e.target[0].value,
            'title-ua': e.target[1].value,
            'text-ru': this.state.editorRu.getData(),
            'text-ua': this.state.editorUa.getData(),
            img: this.state.urls[0],
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
                                <div className="contact_form_title">Add Post</div>

                                <form onSubmit={this.addPost} id="contact_form">
                                    <div
                                        className="contact_form_inputs d-flex flex-md-row flex-column justify-content-between align-items-between">
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Заголовок(Рус)"
                                               required="required" data-error="Title is required."/>
                                        <input type="text" id="contact_form_name"
                                               className="contact_form_name input_field" placeholder="Заголовок"
                                               required="required" data-error="Title is required."/>
                                    </div>
                                    <ImageUploader
                                        withIcon={true}
                                        buttonText='Choose images'
                                        onChange={this.onDrop}
                                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                        maxFileSize={5242880}
                                    />
                                    <button onClick={this.uploadImg} className="button contact_submit_button">Upload images</button>
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

export default AddPost;