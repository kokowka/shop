import React, {Component} from 'react';

import LocalizedStrings from 'react-localization';
import localization from '../data/localization';
import axios from "axios";
import {getSignCurrency, exchangeByCurrentCurrency, roundPriceWithDiscount, getSignLanguage} from "../utils";

let strings = new LocalizedStrings(localization);

class HeaderBanner extends Component{

    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        const currency = localStorage.getItem('currency');
        this.state = {
            banner: {
                price: '',
                img : ''
            },
            exchangeValue: [],
            currency: currency,
            language: language
        }
    }

    componentDidMount() {
        axios.post(`/getBannerByType?type=header`)
            .then(res => {if(res.data[0]) this.setState({banner: res.data[0]})})
            .catch(error => console.log(error));
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
            .catch(error => console.log(error));
    }

    render() {
        return <div>
                <div className="banner">
                    <div className="banner_background"/>
                    <div className="container fill_height">
                        <div className="row fill_height">
                            <div className="banner_product_image"><img src={this.state.banner.img} alt=""/></div>
                            <div className="col-lg-5 offset-lg-4 fill_height">
                                <div className="banner_content">
                                    <h1 className="banner_text">{this.state.banner[`description-${getSignLanguage(this.state.language)}`]}</h1>
                                    <div className="banner_price"><span>{getSignCurrency(this.state.currency)}
                                    {exchangeByCurrentCurrency(this.state.banner.price, this.state.currency, this.state.exchangeValue)}</span>
                                        {getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(roundPriceWithDiscount(this.state.banner.price, this.state.banner.discount), this.state.currency, this.state.exchangeValue)}</div>
                                    <a href={`/product?id=${this.state.banner.idOfProduct}`}><div className="banner_product_name">{this.state.banner.name}</div></a>
                                    <div className="button banner_button"><a href={`/product?id=${this.state.banner.idOfProduct}`}>{strings.shopNow}</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="characteristics">
                    <div className="container">
                        <div className="row">

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_1.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.freeDelivery}</div>
                                        <div className="char_subtitle">{strings.from} $50</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_2.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.freeDelivery}</div>
                                        <div className="char_subtitle">{strings.from} $50</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_3.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.freeDelivery}</div>
                                        <div className="char_subtitle">{strings.from} $50</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_4.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.freeDelivery}</div>
                                        <div className="char_subtitle">{strings.from} $50</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    }
}

export default HeaderBanner;