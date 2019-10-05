import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import LocalizedStrings from 'react-localization';
import localization from '../data/localization';
import axios from "axios";

let strings = new LocalizedStrings(localization);

class Comments extends Component{

    constructor(props){
        super(props);
        const language = localStorage.getItem('language');
        strings.setLanguage(language);
        const fullName = localStorage.getItem('fullName') || '';
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");
        this.state = {
            id: id,
            fullName: fullName,
            comments: []
        };
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/getAllCommentById?id=${this.state.id}`)
            .then(result => this.setState({comments: result.data}))
            .catch(error => console.log(error))
    }

    add = (e) => {
        e.preventDefault();
        const fullName = this.state.fullName ? this.state.fullName : e.target[0].value;
        const text = e.target[1].value;
        if(!fullName || !text) return;
        axios.post('http://localhost:3001/addComment', {
            fullName: fullName,
            text: text,
            idOfProduct: this.state.id
        }).then(result => { console.log(result.data)/*this.setState({comments: result.data})*/})
            .catch(error => console.log(error));
    };


    render() {
        return <div className="single">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/comments_styles.css"/>
            </Helmet>
            <div className="container">
                <div className="comments heading">
                    <h3 style={{display: `${this.state.comments.length === 0 ? `none`: ``}`}}>{strings.comments}</h3>
                    {this.state.comments.map((value, key) => {
                        return <div key={key} className="media">
                            <div className="media-left">
                                <img src="assets/images/si.png" alt=""/>
                            </div>
                            <div className="media-body">
                                <h4 className="media-heading">{value.fullName}</h4>
                                <p>{value.text}</p>
                            </div>
                        </div>
                    })}
                </div>
                <div className="comment-bottom heading">
                    <h3>{strings.leaveComment}</h3>
                    <form onSubmit={this.add}>
                        <input type="text" placeholder={strings.fullName} style={{display: `${this.state.fullName ? `none`: ``}`}}/>
                        <textarea cols="77" rows="6" placeholder={strings.message}/>
                        <input className="button cart_button" type="submit" value={strings.send}/>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Comments;