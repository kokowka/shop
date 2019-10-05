import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import LocalizedStrings from 'react-localization';
import localization from "./data/localization";
import axios from 'axios';
import {exchangeByCurrentCurrency} from "./utils";

let strings = new LocalizedStrings(localization);

class Cart extends Component {
    constructor(props) {
        super(props);
        if(!localStorage.getItem('fullName')) window.location.href = '/register';
        const language = localStorage.getItem('language');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if(cart.length === 0) window.location.href = '/shop';
        const currency = localStorage.getItem('currency');
        strings.setLanguage(language);
        this.state = {
            cart: cart,
            currency: currency,
            signCurrency: {
                "₴ Гривня": "₴",
                "₽ Рубль": "₽",
                "$ US dollar": "$"
            },
            exchangeValue: [],
            total: this.getTotal(cart),
            hideNav: false
        }
    }

    componentDidMount() {
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            });
        window.addEventListener("resize", this.resize);
        this.resize();
    }

    resize = () => {
        this.setState({hideNav: window.innerWidth <= 1000});
    };

    getTotal(cart) {
        let total = 0;
        for(let i = 0; i<cart.length; i++)
            total +=Number.parseInt(cart[i].price);
        return total;
    }

    deleteFromCart = e => {
        let cart = this.state.cart;
        cart.splice(e.target.id, 1);
        this.setState({cart: cart, total: this.getTotal(cart)});
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    makeOrder = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/sendEmail`, {
            subject: 'New order',
            html: `${JSON.stringify(this.state.cart)} ${localStorage.getItem('phone')} ${localStorage.getItem('email')}`
        });
        localStorage.removeItem('cart');
        setTimeout(
            () => {
                window.location.href = '/';
            },
            100
        );
    };

    render() {
        return <div className="super_container">
            <Helmet>
                <title>{strings.cart}</title>
                <link rel="stylesheet" type="text/css" href="assets/styles/cart_styles.css"/>
                <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet"/>
            </Helmet>
            <Header/>
            <div className="cart_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="cart_container">
                                <div className="cart_title">{strings.shoppingCart}</div>
                                <div className="cart_items">
                                    <ul className="cart_list">
                                        {this.state.cart.map((value, key) => {
                                            return <li key={key} className="cart_item clearfix">
                                                <a href={"/product?id="+value.id} className="cart_item_image"><img src={value.img} alt=""/></a>
                                                <div
                                                    className="cart_item_info d-flex flex-md-row flex-column justify-content-between">
                                                    <div className="cart_item_name cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.name}</div>
                                                        <div className="cart_item_text">{value.name}</div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_color cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.color}</div>
                                                        <div className="cart_item_text"><span style={{backgroundColor:value.color, marginLeft: "5px"}}/>
                                                        </div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_quantity cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.quantity}</div>
                                                        <div className="cart_item_text" style={{marginLeft: "30px"}}>{value.quantity}</div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_price cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.price}</div>
                                                        <div className="cart_item_text" style={{marginLeft: "30px"}}>{this.state.signCurrency[this.state.currency]}{exchangeByCurrentCurrency(value.price, this.state.currency, this.state.exchangeValue) * value.quantity}</div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_total cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.total}</div>
                                                        <div className="cart_item_text" style={{marginLeft: "30px"}}>{this.state.signCurrency[this.state.currency]}{exchangeByCurrentCurrency(value.price, this.state.currency, this.state.exchangeValue) * value.quantity}</div>
                                                    </div>
                                                    <a href={window.location.href} style={{marginLeft: '200px', marginTop: this.state.hideNav ? `-50px`: ``}} onClick={this.deleteFromCart}><span id={key} className="glyphicon glyphicon-remove" style={{marginTop: "20px", color: "#FF6347"}}/></a>
                                                </div>
                                            </li>
                                        })}
                                    </ul>
                                </div>

                                <div className="order_total">
                                    <div className="order_total_content text-md-right">
                                        <div className="order_total_title">{strings.orderTotal}:</div>
                                        <div className="order_total_amount">{this.state.signCurrency[this.state.currency]}{this.state.total}</div>
                                    </div>
                                </div>

                                <div className="cart_buttons">
                                    <button type="button" onClick={this.makeOrder} className="button cart_button_checkout">{strings.makeAnOrder}</button>
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

export default Cart;