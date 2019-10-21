import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import LocalizedStrings from 'react-localization';
import localization from "./data/localization";
import axios from "axios";
import {exchangeByCurrentCurrency} from "./utils";

let strings = new LocalizedStrings(localization);

class WishList extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        const wishList = JSON.parse(localStorage.getItem('wishList')) || [];
        if(wishList.length === 0) window.location.href = '/shop';
        const currency = localStorage.getItem('currency');
        strings.setLanguage(language);
        this.state = {
            wishList: wishList,
            currency: currency,
            signCurrency: {
                "₴ Гривня": "₴",
                "₽ Рубль": "₽",
                "$ US dollar": "$"
            },
            exchangeValue: [],
            hideNav: false,
            isLoading: true
        }
    }

    componentDidMount() {
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
        window.addEventListener("resize", this.resize);
        this.resize();
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    resize = () => {
        this.setState({hideNav: window.innerWidth <= 1000});
    };


    deleteFromWishList = e => {
        let wishList = this.state.wishList;
        wishList.splice(e.target.id, 1);
        this.setState({wishList: wishList});
        localStorage.setItem('wishList', JSON.stringify(wishList));
    };


    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <title>{strings.wishList}</title>
                <link rel="stylesheet" type="text/css" href="assets/styles/cart_styles.css"/>
                <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet"/>
            </Helmet>
            <Header/>
            <div className="cart_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="cart_container">
                                <div className="cart_title">{strings.wishList}</div>
                                <div className="cart_items">
                                    <ul className="cart_list">
                                        {this.state.wishList.map((value, key) => {
                                            return <li key={key} className="cart_item clearfix">
                                                <a href={"/product?id="+value.id} className="cart_item_image"><img src={value.img} alt=""/></a>
                                                <div
                                                    className="cart_item_info d-flex flex-md-row flex-column justify-content-between">
                                                    <div className="cart_item_name cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.name}</div>
                                                        <div className="cart_item_text">{value.name}</div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_price cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.price}</div>
                                                        <div className="cart_item_text" style={{marginLeft: "30px"}}>{this.state.signCurrency[this.state.currency]}{exchangeByCurrentCurrency(value.price, this.state.currency, this.state.exchangeValue)}</div>
                                                    </div>
                                                    <a href={window.location.href} style={{marginLeft: '200px', marginTop: this.state.hideNav ? `-50px`: ``}} onClick={this.deleteFromWishList}><span id={key} className="glyphicon glyphicon-remove" style={{marginTop: "20px", color: "#FF6347"}}/></a>
                                                </div>
                                            </li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default WishList;