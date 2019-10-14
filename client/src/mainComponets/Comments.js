import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import LocalizedStrings from 'react-localization';
import localization from '../data/localization';
import axios from "axios";
import Slider from "react-slick";

let strings = new LocalizedStrings(localization);

class Comments extends Component{

    constructor(props){
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        const fullName = localStorage.getItem('fullName') || '';
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");
        this.state = {
            id: id,
            fullName: fullName,
            comments: [],
            sliderSetting: {
                arrows: false,
                dots: false,
                infinite: false,
                vertical: true,
                verticalSwiping: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        };
    }

    componentDidMount() {
        axios.post(`/getAllCommentById?id=${this.state.id}`)
            .then(result => this.setState({comments: result.data.reverse()}))
            .catch(error => console.log(error))
    }

    add = (e) => {
        e.preventDefault();
        const fullName = this.state.fullName ? this.state.fullName : e.target[0].value;
        const text = e.target[1].value;
        if(!fullName || !text) return;
        axios.post(`/addComment`, {
            fullName: fullName,
            text: text,
            idOfProduct: this.state.id
        }).then(result => this.setState({comments: this.state.comments.concat(result.data)}))
            .catch(error => console.log(error));
        window.location.reload();
    };

    onNext = () => {
        this.state.slider.slickNext();
    };

    onPrev = () => {
        this.state.slider.slickPrev();
    };


    render() {
        return <div className="single">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/comments_styles.css"/>
                <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet"/>
            </Helmet>
            <div className="container">
                <div className="comments heading">
                    <h3 style={{display: `${this.state.comments.length === 0 ? `none`: ``}`}}>{strings.comments}</h3>
                    <span style={{display: `${this.state.comments.length <= 3 ? `none`: ``}`, marginLeft: '30px', marginTop: '20px'}} onClick={this.onPrev} className="glyphicon glyphicon-chevron-up"/>
                    <Slider ref={c => this.state.slider = c} {...this.state.sliderSetting}>
                        {this.state.comments.map((value, key) => {
                            return <div key={key} className="media">
                                <div className="media-left">
                                    <img src="assets/images/si.png" alt=""/>
                                </div>
                                <div className="media-right">
                                    {new Date(value.createdAt).toLocaleString('uk-UA', {timeZone: "Europe/Kiev"})}
                                </div>
                                <div className="media-body">
                                    <h4 className="media-heading">{value.fullName}</h4>
                                    <p>{value.text}</p>
                                </div>
                            </div>
                        })}
                    </Slider>
                    <span style={{display: `${this.state.comments.length <= 3 ? `none`: ``}`, marginLeft: '30px'}} onClick={this.onNext} className="glyphicon glyphicon-chevron-down"/>
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