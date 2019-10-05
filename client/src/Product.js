import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import axios from "axios";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import StarRatings from 'react-star-ratings';
import {getSignCurrency, getSignLanguage, exchangeByCurrentCurrency, roundPriceWithDiscount, isInWishList} from './utils';
import Comments from './mainComponets/Comments';

let strings = new LocalizedStrings(localization);

class Product extends Component{
    constructor(props){
        super(props);
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");
        const language = localStorage.getItem('language');
        const currency = localStorage.getItem('currency');
        strings.setLanguage(language);
        const wishList = JSON.parse(localStorage.getItem('wishList')) || [];
        const indexOfColor = url.searchParams.get("color") || 0;
        this.state = {
            good: {
                imgs: [],
                colors: [],
                price: {}
            },
            id: id,
            exchangeValue: [],
            language: language,
            mainImg: '',
            currency: currency,
            quantity: 1,
            mainColor: '',
            indexOfColors: indexOfColor,
            rating: 0,
            isInWishList: isInWishList(wishList, id)
        }

    }


    componentDidMount() {
        axios.get('http://localhost:3001/goods/'+this.state.id)
            .then((res) => this.setState({
                good: res.data,
                mainImg: res.data.imgs[this.state.indexOfColors * 3],
                price: res.data.price.$numberDecimal,
                mainColor: res.data.colors[this.state.indexOfColors],
                rating: this.getRating(res.data.rating)}))
            .catch(error => console.log(error));
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
            .catch(error => console.log(error));
    }

    onImgClick = e => {
        this.setState({mainImg: e.target.src})
    };

    onUpQuantity = () => {
        this.setState({quantity:this.state.quantity + 1});
    };

    onDownQuantity = () => {
        if(this.state.quantity !==1) this.setState({quantity:this.state.quantity - 1});
    };

    onColorClick = e => {
        const val = e.target.style.background;
        const listOfCodes = val.replace( /^\D+/, '').replace(')', '').split(', ');
        const hex = '#' + this.rgbToHex(listOfCodes[0]) + this.rgbToHex(listOfCodes[1]) + this.rgbToHex(listOfCodes[2]);
        const indexOfColors = this.state.good.colors.indexOf(hex);
        this.setState({mainColor: val, indexOfColors: indexOfColors, mainImg: this.state.good.imgs[indexOfColors * 3]});
    };

    rgbToHex = function (rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    changeRating = rating => {
        const isVoting = localStorage.getItem(`vote${this.state.id}`);
        if(!isVoting) {
            axios.put('http://localhost:3001/goods/updateRating', {id: this.state.id, rating: rating})
                .then((res) => {
                    localStorage.setItem(`vote${this.state.id}`, 'vote');
                    res.data.rating.push(rating);
                    const rate = this.getRating(res.data.rating);
                    this.setState({rating: rate});
                    axios.put('http://localhost:3001/goods/updateRate', {id: this.state.id, rate: rate});
                })
                .catch(error => console.log(error));
        }
    };

    getRating = (rates) => {
      let sum = 0;
      const length = rates.length;
      if(length === 0) return 0;
      for(let i = 0; i<length; i++)
          sum += rates[i];
      return sum / length;
    };

    changeWishList = () => {
        let list = [];
        const wishList = JSON.parse(localStorage.getItem('wishList'));
        if(wishList) list = wishList;
        const isActive = document.getElementsByClassName('product_fav')[0].className.split(' ')[1];
        if(!isActive) {
            list.push({id: this.state.id, price: roundPriceWithDiscount(this.state.price, this.state.good.discount), color: this.state.mainColor, img: this.state.mainImg, name: this.state.good.name});
            localStorage.setItem('wishList', JSON.stringify(list));
            this.setState({isInWishList: true});
        }
        else {
            let index = -1;
            for(let i = 0; i<list.length; i++) {
                if(list[i].id === this.state.id)
                    index = i;
            }
            if (index > -1) {
                list.splice(index, 1);
            }
            localStorage.setItem('wishList', JSON.stringify(list));
            this.setState({isInWishList: false});
        }
    };
    addToCart = () => {
        let items = [];
        const getAllCart = localStorage.getItem('cart');
        if(getAllCart) items = JSON.parse(getAllCart);
        items.push({id: this.state.id, price: roundPriceWithDiscount(this.state.price, this.state.good.discount), quantity: this.state.quantity, color: this.state.mainColor, img: this.state.mainImg, name: this.state.good.name});
        localStorage.setItem('cart', JSON.stringify(items));
        window.location.href = '/cart';
    };


    render() {
        return <div className="super_container">
            <Helmet>
                <title>{this.state.good.name}</title>
                <link rel="stylesheet" type="text/css" href="assets/styles/product_styles.css"/>
                <link rel="stylesheet" type="text/css" href="assets/styles/product_responsive.css"/>
            </Helmet>
            <Header/>
            <div className="single_product">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 order-lg-1 order-2">
                            <ul className="image_list">
                                <li><img onClick={this.onImgClick} src={this.state.good.imgs[this.state.indexOfColors * 3]} alt=""/></li>
                                <li><img onClick={this.onImgClick} src={this.state.good.imgs[this.state.indexOfColors * 3 + 1]} alt=""/></li>
                                <li><img onClick={this.onImgClick} src={this.state.good.imgs[this.state.indexOfColors * 3 + 2]} alt=""/></li>
                            </ul>
                        </div>

                        <div className="col-lg-5 order-lg-2 order-1">
                            <div className="image_selected"><img src={this.state.mainImg} alt=""/></div>
                        </div>

                        <div className="col-lg-5 order-3">
                            <div className="product_description">
                                <div className="product_category">{strings[this.state.good.category]}</div>
                                <div className="product_name">{this.state.good.name}</div>
                                <StarRatings
                                    rating={this.state.rating}
                                    changeRating={this.changeRating}
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension='25px'
                                    starRatedColor='rgb(255, 128, 0)'
                                />
                                <div className="product_text"><p>{this.state.good[`description-${getSignLanguage(this.state.language)}`]}</p></div>
                                <div className="order_info d-flex flex-row">
                                    <form>
                                        <div className="clearfix">
                                            <div className="product_quantity clearfix">
                                                <span>{strings.quantity}: </span>
                                                <input id="quantity_input" type="text" value={this.state.quantity} readOnly/>
                                                    <div className="quantity_buttons">
                                                        <div id="quantity_inc_button"
                                                             className="quantity_inc quantity_control" onClick={this.onUpQuantity}><i
                                                            className="fas fa-chevron-up"/></div>
                                                        <div id="quantity_dec_button"
                                                             className="quantity_dec quantity_control" onClick={this.onDownQuantity}><i
                                                            className="fas fa-chevron-down"/></div>
                                                    </div>
                                            </div>

                                            <ul className="product_color">
                                                <li>
                                                    <span>{strings.color}: </span>
                                                    <div className="color_mark_container">
                                                        <div id="selected_color" className="color_mark" style={{background: this.state.mainColor}} />
                                                    </div>
                                                    <div className="color_dropdown_button"><i
                                                        className="fas fa-chevron-down"/></div>

                                                    <ul className="color_list">
                                                        {this.state.good.colors.map((value) => {
                                                            return <li key={value}><div onClick={this.onColorClick} className="color_mark"
                                                                     style={{background: value}} /></li>
                                                        })}
                                                    </ul>
                                                </li>
                                            </ul>

                                        </div>

                                        <div className="product_price">{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(roundPriceWithDiscount(this.state.good.price['$numberDecimal'], this.state.good.discount), this.state.currency, this.state.exchangeValue)}</div>
                                        <div className="button_container">
                                            <button type="button" onClick={this.addToCart} className="button cart_button">{strings.addToCart}</button>
                                            <div onClick={this.changeWishList} className={`product_fav${this.state.isInWishList ? ` active`: ``}`}><i className="fas fa-heart"/></div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Comments/>
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

export default Product;