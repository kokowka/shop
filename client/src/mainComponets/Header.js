import React, {Component} from "react";
import LocalizedStrings from 'react-localization';
import localization from '../data/localization';
import {exchangeByCurrentCurrency, getSignCurrency} from '../utils';
import axios from "axios";
import Autosuggest from 'react-autosuggest'
import {Helmet} from "react-helmet";

let strings = new LocalizedStrings(localization);

class Header extends Component {

    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська' || 'Українська';
        const fullName = localStorage.getItem('fullName');
        let languages = ["Українська", "Русский", "English"];
        let currencies = ["₴ Гривня", "₽ Рубль", "$ US dollar"];
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const wishList = JSON.parse(localStorage.getItem('wishList')) || [];
        const indexOfValue = languages.indexOf(language);
        const firstLanguage = languages[0];
        languages[indexOfValue] = firstLanguage;
        languages[0] = language;

        let currency = localStorage.getItem('currency');
        if(!currency) localStorage.setItem('currency', '₴ Гривня');
        else {
            const indexOfValue = currencies.indexOf(currency);
            const firstCurrency = currencies[0];
            currencies[indexOfValue] = firstCurrency;
            currencies[0] = currency;
        }
        strings.setLanguage(language);

        setInterval(this.updateStorageInfo, 1000);
        this.state = {
            exchangeValue: [],
            language: languages,
            currencies: currencies,
            searchCategories: localization[language].searchCategories,
            wishList: wishList.length,
            cartList: cart.length,
            cartPrice: this.getCartPrice(cart),
            fullName: fullName,
            goods: [],
            suggestions: [],
            searchValue: '',
            category: '',
            bestProposition: [],
            brands: [],
            hideNavWelcome: false,
            hideEmail: false
        };
    }

     componentDidMount() {
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
            .catch(error => console.log(error));
        axios.get(`${process.env.REACT_APP_API_URL}/goods/getAllGoods`)
            .then(result => {
                this.setState({goods: result.data, bestProposition: result.data.slice(0, 5)})
            })
            .catch(error => console.log(error));
         axios.get(`${process.env.REACT_APP_API_URL}/getAll?type=brand`)
             .then(result => {
                 this.setState({brands: result.data.result.slice(0, 5)});
             })
             .catch(error => console.log(error));
         window.addEventListener("resize", this.resize);
         this.resize();
    }

    resize = () => {
        this.setState({hideNavWelcome: window.innerWidth <= 1200, hideEmail: window.innerWidth <= 1000});
    };

    updateStorageInfo = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const wishList = JSON.parse(localStorage.getItem('wishList')) || [];
        this.setState({
            wishList: wishList.length,
            cartList: cart.length,
            cartPrice: this.getCartPrice(cart)
        });
    };

    getCartPrice = (cart) => {
        let price = 0;
        for(let i = 0; i<cart.length; i++)
            price += Number.parseInt(cart[i].price);
        return price;
    };

    onClickLanguage = (e) => {
        const value = e.currentTarget.textContent;
        strings.setLanguage(value);
        const indexOfValue = this.state.language.indexOf(value);
        let language = this.state.language;
        language[indexOfValue] = this.state.language[0];
        language[0] = value;
        localStorage.setItem('language', value);
        this.setState({
            language: language,
            searchCategories: localization[value].searchCategories
        });
    };

    onClickCurrency = (e) => {
        const value = e.currentTarget.textContent;
        const indexOfValue = this.state.currencies.indexOf(value);
        let currencies = this.state.currencies;
        currencies[indexOfValue] = this.state.currencies[0];
        currencies[0] = value;
        localStorage.setItem('currency', value);
        this.setState(currencies);
    };

    onClickSearchCategories = (e) => {
      let searchCategories = this.state.searchCategories;
      const current = e.currentTarget.textContent;
      const indexOf = searchCategories.indexOf(current);
      if(indexOf === 2 || indexOf === 3) {
          axios.get(`${process.env.REACT_APP_API_URL}/goods/getAllGoods?category=computerAndLaptops`)
              .then(result => this.setState({goods: result.data, category: 'computerAndLaptops'}))
              .catch(error => console.log(error));
      } else if(indexOf === 4) {
          axios.get(`${process.env.REACT_APP_API_URL}/goods/getAllGoods?category=cameras`)
              .then(result => this.setState({goods: result.data, category: 'cameras'}))
              .catch(error => console.log(error));
      } else if(indexOf === 5) {
          axios.get(`${process.env.REACT_APP_API_URL}/goods/getAllGoods?category=hardware`)
              .then(result => this.setState({goods: result.data, category: 'hardware'}))
              .catch(error => console.log(error));
      } else if(indexOf === 6) {
          axios.get(`${process.env.REACT_APP_API_URL}/goods/getAllGoods?category=phones`)
              .then(result => this.setState({goods: result.data, category: 'phones'}))
              .catch(error => console.log(error));
      } else {
          axios.get(`${process.env.REACT_APP_API_URL}/goods/getAllGoods`)
              .then(result => this.setState({goods: result.data, category: ''}))
              .catch(error => console.log(error));
      }
      searchCategories[0] = current;
      this.setState({searchCategories: searchCategories});
    };

    logout = () => {
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        window.location.href = '/';
    };

    showListOfCategory = (e) => {
        const tag = e.target.tagName;
        if(tag === 'I' || tag === 'SPAN') document.getElementsByClassName('custom_list')[0].className += ' active';
        else {
            document.getElementsByClassName('custom_list')[0].className = 'custom_list clc';
        }
    };

    onSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        const suggestions = inputLength === 0 ? [] : this.state.goods.filter(lang =>
            lang.name.toLowerCase().slice(0, inputLength) === inputValue
        );
        this.setState({
            suggestions: suggestions.slice(0, 5)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onChangeSearch = (e, {newValue}) => {
        this.setState({
            searchValue: newValue
        });
    };

    getSuggestionValue = suggestion => suggestion.name;

    renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    renderInputComponent = inputProps => (
        <input {...inputProps} type="search" required="required" className="header_search_input"
               placeholder={strings.search}/>
    );

    search = (e) => {
        e.preventDefault();
        window.location.href = `/shop?category=${this.state.category}&name=${this.state.searchValue}`;
    };


    render() {
        return <header className="header">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/search.css"/>
            </Helmet>
            <div className="top_bar">
                <div className="container">
                    <div className="row">
                        <div className="col d-flex flex-row">
                            <div className="top_bar_contact_item">
                                <div className="top_bar_icon"><img src="assets/images/phone.png" alt=""/></div>
                                +380930559464
                            </div>
                            <div style={this.state.hideEmail ? {display: 'none'}:{}} className="top_bar_contact_item">
                                <div className="top_bar_icon"><img src="assets/images/mail.png" alt=""/></div>
                                <a href={"mailto:bazarchick.shop@yahoo.com"}>bazarchick.shop@yahoo.com</a></div>
                            <div className="top_bar_content ml-auto">
                                <div className="top_bar_menu">
                                    <ul className="standard_dropdown top_bar_dropdown">
                                        <li>
                                            <a href={window.location.href}>{this.state.language[0]}<i className="fas fa-chevron-down"/></a>
                                            <ul>
                                                <li><a href={window.location.href} onClick={this.onClickLanguage}>{this.state.language[1]}</a></li>
                                                <li><a href={window.location.href} onClick={this.onClickLanguage}>{this.state.language[2]}</a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href={window.location.href}>{this.state.currencies[0]}<i className="fas fa-chevron-down"/></a>
                                            <ul>
                                                <li><a href={window.location.href} onClick={this.onClickCurrency}>{this.state.currencies[1]}</a></li>
                                                <li><a href={window.location.href} onClick={this.onClickCurrency}>{this.state.currencies[2]}</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="top_bar_user">
                                    <div className="user_icon"><img src="assets/images/user.svg" alt=""/></div>
                                    <div style={this.state.hideNavWelcome ? {display: 'none'}:{}}>{this.state.fullName ? `${strings.welcome}${this.state.fullName}`:<a href={'/register'}>{strings.register}</a>}</div>
                                    <div><a href={this.state.fullName ? '#':'/singIn'} onClick={this.state.fullName ? this.logout : ()=>{}}>{this.state.fullName ? strings.logOut : strings.singIn}</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header_main">
                <div className="container">
                    <div className="row">

                        <div className="col-lg-2 col-sm-3 col-3 order-1">
                            <div className="logo_container">
                                <div className="logo"><a href={'/'}>Bazar</a></div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-12 order-lg-2 order-3 text-lg-left text-right">
                            <div className="header_search">
                                <div className="header_search_content">
                                    <div className="header_search_form_container">
                                        <form onSubmit={this.search} action="search" className="header_search_form clearfix">
                                            <Autosuggest
                                                suggestions={this.state.suggestions}
                                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                getSuggestionValue={this.getSuggestionValue}
                                                renderSuggestion={this.renderSuggestion}
                                                inputProps={{
                                                    value: this.state.searchValue,
                                                    onChange: this.onChangeSearch
                                                }}
                                                renderInputComponent={this.renderInputComponent}
                                            />
                                                <div onClick={this.showListOfCategory} className="custom_dropdown">
                                                    <div className="custom_dropdown_list">
                                                        <span className="custom_dropdown_placeholder clc">{this.state.searchCategories[0]}</span>
                                                        <i className="fas fa-chevron-down"/>
                                                        <ul className="custom_list clc">
                                                            <li><a href={"#"} onClick={this.onClickSearchCategories} className="clc">{this.state.searchCategories[1]}</a></li>
                                                            <li><a href={"#"} onClick={this.onClickSearchCategories} className="clc">{this.state.searchCategories[2]}</a></li>
                                                            <li><a href={"#"} onClick={this.onClickSearchCategories} className="clc">{this.state.searchCategories[3]}</a></li>
                                                            <li><a href={"#"} onClick={this.onClickSearchCategories} className="clc">{this.state.searchCategories[4]}</a></li>
                                                            <li><a href={"#"} onClick={this.onClickSearchCategories} className="clc">{this.state.searchCategories[5]}</a></li>
                                                            <li><a href={"#"} onClick={this.onClickSearchCategories} className="clc">{this.state.searchCategories[6]}</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <button type="submit" className="header_search_button trans_300" value="Submit"><img src="assets/images/search.png" alt=""/></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-9 order-lg-3 order-2 text-lg-left text-right">
                            <div className="wishlist_cart d-flex flex-row align-items-center justify-content-end">
                                <div className="wishlist d-flex flex-row align-items-center justify-content-end">
                                    <div className="wishlist_icon"><img src="assets/images/heart.png" alt=""/></div>
                                    <div className="wishlist_content">
                                        <div className="wishlist_text"><a href={"/wishList"}>{strings.wishList}</a></div>
                                        <div className="wishlist_count">{this.state.wishList}</div>
                                    </div>
                                </div>

                                <div className="cart">
                                    <div
                                        className="cart_container d-flex flex-row align-items-center justify-content-end">
                                        <div className="cart_icon">
                                            <img src="assets/images/cart.png" alt=""/>
                                                <div className="cart_count"><span>{this.state.cartList}</span></div>
                                        </div>
                                        <div className="cart_content">
                                            <div className="cart_text"><a href={"/cart"}>{strings.cart}</a></div>
                                            <div className="cart_price">{exchangeByCurrentCurrency(this.state.cartPrice, this.state.currency, this.state.exchangeValue)} {getSignCurrency(this.state.currencies[0])}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="main_nav">
                <div className="container">
                    <div className="row">
                        <div className="col">

                            <div className="main_nav_content d-flex flex-row">

                                <div className="cat_menu_container">
                                    <div
                                        className="cat_menu_title d-flex flex-row align-items-center justify-content-start">
                                        <div className="cat_burger"><span/><span/><span/></div>
                                        <div className="cat_menu_text">{strings.categories}</div>
                                    </div>

                                    <ul className="cat_menu">
                                        <li><a href={'/shop?category=computerAndLaptops'}>{strings.computerAndLaptops} <i className="fas fa-chevron-right ml-auto"/></a></li>
                                        <li><a href={'/shop?category=cameras'}>{strings.cameras}<i className="fas fa-chevron-right"/></a>
                                        </li>
                                        <li><a href={'/shop?category=hardware'}>{strings.hardware}<i className="fas fa-chevron-right"/></a>
                                        </li>
                                        <li><a href={'/shop?category=phones'}>{strings.phones}<i className="fas fa-chevron-right"/></a></li>
                                        <li><a href={'/shop?category=tv'}>{strings.tv}<i className="fas fa-chevron-right"/></a></li>
                                        <li><a href={'/shop?category=gadgets'}>{strings.gadgets}<i className="fas fa-chevron-right"/></a></li>
                                        <li><a href={'/shop?category=electronics'}>{strings.electronics}<i className="fas fa-chevron-right"/></a></li>
                                        <li><a href={'/shop?category=consoles'}>{strings.consoles}<i className="fas fa-chevron-right"/></a></li>
                                        <li><a href={'/shop?category=accessories'}>{strings.accessories}<i className="fas fa-chevron-right"/></a></li>
                                    </ul>
                                </div>

                                <div className="main_nav_menu ml-auto">
                                    <ul className="standard_dropdown main_nav_dropdown">
                                        <li className="hassubs">
                                            <a href={'/shop'}>{strings.superDeals}<i className="fas fa-chevron-down"/></a>
                                            <ul>
                                                {
                                                    this.state.bestProposition.map((value, key) =>{
                                                    return <li key={key}>
                                                        <a href={`/product?id=${value.id}`}>{value.name}<i
                                                            className="fas fa-chevron-down"/></a>
                                                    </li>
                                                })
                                                }
                                            </ul>
                                        </li>
                                        <li className="hassubs">
                                            <a href={'/shop'}>{strings.featuredBrands}<i className="fas fa-chevron-down"/></a>
                                            <ul> { this.state.brands.map((value, key) => {
                                                return <li key={key}>
                                                    <a href={`/shop?brand=${value}`}>{value}<i
                                                        className="fas fa-chevron-down"/></a>
                                                </li>
                                            })
                                            }
                                            </ul>
                                        </li>
                                        <li><a href={"/contact"}>{strings.contact}<i className="fas fa-chevron-down"/></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>


        </header>

    }
}

export default Header;