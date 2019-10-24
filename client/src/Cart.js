import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import LocalizedStrings from 'react-localization';
import localization from "./data/localization";
import axios from 'axios';
import {exchangeByCurrentCurrency, makeSmallerStr} from "./utils";

let strings = new LocalizedStrings(localization);

class Cart extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
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
            hideNav: false,
            isLoading: true,
            isErrorEmail: false,
            isErrorFullName: false,
            isErrorPhone: false,
            isRegister: !!localStorage.getItem('fullName'),
            isMadeOrder: false
        }
    }

    componentDidMount() {
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            });
        window.addEventListener("resize", this.resize);
        this.resize();
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    resize = () => {
        this.setState({hideNav: window.innerWidth <= 1000});
    };

    getTotal(cart) {
        let total = 0;
        for(let i = 0; i<cart.length; i++)
            total +=Number.parseInt(cart[i].price) * cart[i].quantity;
        return total;
    }

    deleteFromCart = e => {
        let cart = this.state.cart;
        cart.splice(e.target.id, 1);
        this.setState({cart: cart, total: this.getTotal(cart)});
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    makeOrder = () => {
        if(this.state.isMadeOrder) {
            window.location.href = '/';
            return;
        }
        const isRegister = this.state.isRegister;
        const phoneField = isRegister ? localStorage.getItem('phone') : document.getElementById('codeOfNumber').value
            + document.getElementById('number').value;
        const emailField = isRegister ? localStorage.getItem('email') : document.getElementById('email').value;
        const fullNameField = isRegister ? localStorage.getItem('fullName'): document.getElementById('fullName').value;

        if(phoneField.length < 10) {
            this.setState({isErrorPhone: true});
            return;
        }
        if(!emailField.includes('@')){
            this.setState({isErrorEmail: true});
            return;
        }
        if(fullNameField.length === 0){
            this.setState({isErrorFullName: true});
            return;
        }

        axios.post(`/sendEmail`, {
            subject: 'New order',
            html: `${JSON.stringify(this.state.cart)} ${fullNameField} ${emailField} ${phoneField}`
        });
        localStorage.removeItem('cart');
        this.setState({isMadeOrder: true});

    };

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <title>{strings.cart}</title>
                <link rel="stylesheet" type="text/css" href="assets/styles/cart_styles.css"/>
                <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet"/>
                <link rel="stylesheet" type="text/css" href="assets/styles/register.css"/>
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
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{makeSmallerStr(strings.name, 25)}</div>
                                                        <div className="cart_item_text">{value.name}</div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_quantity cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.quantity}</div>
                                                        <div className="cart_item_text" style={{marginLeft: "30px"}}>{value.quantity}</div>
                                                    </div>
                                                    <div style={{display: this.state.hideNav ? `none`: ``}} className="cart_item_price cart_info_col">
                                                        <div className="cart_item_title" style={key === 0 ? {} : {display: "none"}}>{strings.price}</div>
                                                        <div className="cart_item_text" style={{marginLeft: "30px"}}>{this.state.signCurrency[this.state.currency]}{exchangeByCurrentCurrency(value.price, this.state.currency, this.state.exchangeValue)}</div>
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
                                        <div className="order_total_amount">{this.state.signCurrency[this.state.currency]}{exchangeByCurrentCurrency(this.state.total, this.state.currency, this.state.exchangeValue)}</div>
                                    </div>
                                </div>
                                <center>
                                    <div style={{display: this.state.isRegister ? `none` : ``}} className="cart_not_register">
                                        <div className="form-group input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"> <i className="fa fa-user"/> </span>
                                            </div>
                                            <input id="fullName" name="" className={`form-control${this.state.isErrorFullName ? ' error': ''}`} placeholder="Full name" type="text"/>
                                        </div>
                                        <div className="form-group input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"> <i className="fa fa-envelope"/> </span>
                                            </div>
                                            <input id="email" name="" className={`form-control${this.state.isErrorEmail ? ' error': ''}`} placeholder="Email address" type="email"/>
                                        </div>
                                        <div className="form-group input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"> <i className="fa fa-phone"/> </span>
                                            </div>
                                            <select id="codeOfNumber" className="custom-select">
                                                <option select="">+380</option>
                                                <option value="1">+7</option>
                                                <option value="2">+48</option>
                                            </select>
                                            <input id="number" name="" className={`form-control${this.state.isErrorPhone ? ' error': ''}`} placeholder="Phone number" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{display: this.state.isMadeOrder ? `` : `none`}} className="alert alert-secondary" role="alert">
                                        {strings.madeOrder}
                                    </div>
                                </center>

                                <div className="cart_buttons">
                                    <button type="button" onClick={this.makeOrder} className="button cart_button_checkout">{ this.state.isMadeOrder ? strings.continueBuy:strings.makeAnOrder}</button>
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