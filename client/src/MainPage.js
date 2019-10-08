import React, {Component} from "react";
import Header from './mainComponets/Header';
import HeaderBanner from './mainComponets/HeaderBanner';
import FooterBanner from './mainComponets/FooterBanner';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import Slider from "react-slick";
import Timer from 'react-compound-timer';
import axios from "axios";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import {exchangeByCurrentCurrency, getSignCurrency, roundPriceWithDiscount, isInWishList, isActiveWish} from "./utils";

let strings = new LocalizedStrings(localization);

class MainPage extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        const currency = localStorage.getItem('currency');
        setInterval(this.updateTimerOfSuperPropose, 60000);
        strings.setLanguage(language);
        this.state = {
            dealsSliderSettings: {
                dots: false,
                arrows: false,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplaySpeed: 9000,
                autoplay: true
            },
            goodsSliderSetting:{
                dots: true,
                infinite: false,
                arrows: false,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 6,
                rows: 2,
            },
            categorySliderSetting:{
                dots: false,
                arrows: false,
                infinite: true,
                speed: 500,
                slidesToShow: 4,
                slidesToScroll: 1,
                autoplaySpeed: 5000,
                autoplay: true,
                rows: 1
            },
            superPropose: [],
            currency: currency,
            exchangeValue: [],
            goods: [],
            currentGoodsDot: 1,
            currentFeatured: 0,
            isActive: [],
            isLoading: true
        };
    }

    componentDidMount() {
        axios.post(`/getSuperPropose`)
            .then(res => this.setState({superPropose: res.data}))
            .catch(error => console.log(error));
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
            .catch(error => console.log(error));
        axios.post(`/getBestGoods?size=20`)
            .then(res => this.setState({goods: res.data, isActive: isActiveWish(this.state.isActive, res.data)}))
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    updateTimerOfSuperPropose = () => {
        const superPropose = this.state.superPropose;
        for(let i = 0; i<superPropose.length; i++) {
            let timer = superPropose[i].timerOfPropose - 60000;
            if(timer < 0) timer = 0;
            superPropose[i].timer = timer;
            axios.put(`/setTimerForSuperProposition`, {id: superPropose[i].id, timer: timer})
                .catch(error => console.log(error))
        }
    };

    changeGoods = (e) => {
      const chosen = e.target;
      const childNodes = e.target.parentElement.childNodes;
      if(childNodes.length === 3){
          const arr = Array.prototype.slice.call(childNodes);
          const index = arr.indexOf(chosen);
          childNodes[this.state.currentFeatured].className = '';
          chosen.className = 'active';
          let sizeOfStrings = 0;
          for(let i = 0; i<index; i++)
              sizeOfStrings += childNodes[i].innerText.length * 13;
          document.getElementsByClassName('tabs_line')[0].childNodes[0].style.marginLeft = `${index * 20 + sizeOfStrings}px`;
          if(index === 0)
              axios.post(`/getBestGoods?size=20`)
                  .then(res => this.setState({goods: res.data, isActive: isActiveWish(this.state.isActive, res.data)}));
          else if(index === 1)
              axios.post(`/getDiscountGoods?size=20`)
                  .then(res => this.setState({goods: res.data, isActive: isActiveWish(this.state.isActive, res.data)}));
          else
              axios.post(`/getNewGoods?size=20`)
                  .then(res => this.setState({goods: res.data, isActive: isActiveWish(this.state.isActive, res.data)}));
          this.setState({currentFeatured: index});
      }
    };


    changeDots = (e) => {
        if(e.target.childNodes[0]) {
            const dotsNumber = e.target.childNodes[0].innerText;
            const parentElement = e.target.parentElement;
            if (dotsNumber) {
                this.state.goodsSlider.slickGoTo(dotsNumber);
                e.target.className = 'slick-active';
                parentElement.childNodes[this.state.currentGoodsDot - 1].className = '';
                this.setState({currentGoodsDot: dotsNumber});
            }
        }
    };

    changeWishList = (e) => {
        let list = [];
        const wishList = JSON.parse(localStorage.getItem('wishList'));
        if(wishList) list = wishList;
        const allClassNames = e.target.className.split(' ');
        const indexOfGoods = e.target.parentNode.getAttribute('value');
        if(allClassNames[1] !== 'active') {
            list.push({id: this.state.goods[indexOfGoods].id, price: roundPriceWithDiscount(this.state.goods[indexOfGoods].price["$numberDecimal"], this.state.goods[indexOfGoods].discount), color: this.state.goods[indexOfGoods].colors[0], img: this.state.goods[indexOfGoods].imgs[0], name: this.state.goods[indexOfGoods].name});
            localStorage.setItem('wishList', JSON.stringify(list));
            this.setState({isActive: this.state.isActive.concat({id: indexOfGoods})});
            e.target.className += ' active';
        }
        else {
            let index = -1;
            for(let i = 0; i<list.length; i++) {
                if(list[i].id === this.state.goods[indexOfGoods].id)
                    index = i;
            }
            if (index > -1) {
                list.splice(index, 1);
            }
            localStorage.setItem('wishList', JSON.stringify(list));
            e.target.className = allClassNames[0];
        }
    };

    addToCart = (e) => {
        const index = e.target.value;
        let items = [];
        const getAllCart = localStorage.getItem('cart');
        if(getAllCart) items = JSON.parse(getAllCart);
        items.push({id: this.state.goods[index].id, price: roundPriceWithDiscount(this.state.goods[index].price["$numberDecimal"], this.state.goods[index].discount), quantity: 1, color: this.state.goods[index].colors[0], img: this.state.goods[index].imgs[0], name: this.state.goods[index].name});
        localStorage.setItem('cart', JSON.stringify(items));
    };


    onPrevDeals = () => {
        this.state.dealsSlider.slickPrev();
    };

    onNextDeals = () => {
        this.state.dealsSlider.slickNext();
    };

    onPrevCategory = () => {
        this.state.categorySlider.slickPrev();
    };

    onNextCategory = () => {
        this.state.categorySlider.slickNext();
    };

    onClickColor = (e) => {
        const color = e.target.value;
        const id = e.target.parentElement.getAttribute('value');
        window.location.href = `/product?id=${id}&color=${color}`;
    };

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/main_styles.css"/>
            </Helmet>
            <Header/>
            <HeaderBanner/>
            <div className="deals_featured">
                <div className="container">
                    <div className="row">
                        <div className="col d-flex flex-lg-row flex-column align-items-center justify-content-start">

                            <div className="deals">
                                <div className="deals_title">{strings.deals}</div>
                                <div className="deals_slider_container">

                                    <Slider ref={c => this.state.dealsSlider = c} {...this.state.dealsSliderSettings}>
                                        { this.state.superPropose.map((value, key) => {
                                            return <div key={key} className="owl-item deals_item">
                                                <div className="deals_image"><a href={`/product?id=${value.id}`}><img src={value.imgs[0]} alt=""/></a>
                                                </div>
                                                <div className="deals_content">
                                                    <div
                                                        className="deals_info_line d-flex flex-row justify-content-start">
                                                        <div className="deals_item_category"><a href={`/shop?category=${value.category}`}>{strings[value.category]}</a>
                                                        </div>
                                                        <div className="deals_item_price_a ml-auto"
                                                             style={{textDecoration: "line-through"}}>{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(value.price['$numberDecimal'], this.state.currency, this.state.exchangeValue)}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="deals_info_line d-flex flex-row justify-content-start">
                                                        <div className="deals_item_name"><a href={`/product?id=${value.id}`}>{value.name}</a></div>
                                                        <div className="deals_item_price ml-auto">{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(roundPriceWithDiscount(value.price['$numberDecimal'], value.discount), this.state.currency, this.state.exchangeValue)}</div>
                                                    </div>
                                                    <div className="available">
                                                        <div
                                                            className="available_line d-flex flex-row justify-content-start">
                                                            <div className="available_title">{strings.available}: <span>{value.available}</span>
                                                            </div>
                                                            <div className="sold_title ml-auto">{strings.alreadySold}: <span>{value.sold}</span></div>
                                                        </div>
                                                        <div className="available_bar"><span
                                                            style={{width: (value.sold / value.available * 100) + '%'}}/></div>
                                                    </div>
                                                    <div
                                                        className="deals_timer d-flex flex-row align-items-center justify-content-start">
                                                        <div className="deals_timer_title_container">
                                                            <div className="deals_timer_title">{strings.harryUp}</div>
                                                            <div className="deals_timer_subtitle">{strings.offerEnd}:</div>
                                                        </div>
                                                        <Timer
                                                            initialTime={value.timerOfPropose}
                                                            lastUnit="h"
                                                            direction="backward">
                                                            <div className="deals_timer_content ml-auto">
                                                                <div className="deals_timer_box clearfix"
                                                                     data-target-time="">
                                                                    <div className="deals_timer_unit">
                                                                        <div id="deals_timer1_hr"
                                                                             className="deals_timer_hr"/>
                                                                        <Timer.Hours/>
                                                                        <span>hours</span>
                                                                    </div>
                                                                    <div className="deals_timer_unit">
                                                                        <div id="deals_timer1_min"
                                                                             className="deals_timer_min"/>
                                                                        <Timer.Minutes/>
                                                                        <span>mins</span>
                                                                    </div>
                                                                    <div className="deals_timer_unit">
                                                                        <div id="deals_timer1_sec"
                                                                             className="deals_timer_sec"/>
                                                                        <Timer.Seconds/>
                                                                        <span>secs</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Timer>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                        }
                                    </Slider>

                                </div>

                                <div className="deals_slider_nav_container">
                                    <div onClick={this.onPrevDeals} className="deals_slider_prev deals_slider_nav"><i
                                        className="fas fa-chevron-left ml-auto"/></div>
                                    <div onClick={this.onNextDeals} className="deals_slider_next deals_slider_nav"><i
                                        className="fas fa-chevron-right ml-auto"/></div>
                                </div>
                            </div>
                            <div className="featured">
                                <div className="tabbed_container">
                                    <div className="tabs">
                                        <ul onClick={this.changeGoods} className="clearfix">
                                            <li className="active">{strings.bestRated}</li>
                                            <li>{strings.onSale}</li>
                                            <li>{strings.new}</li>
                                        </ul>
                                        <div className="tabs_line"><span/></div>
                                    </div>
                                    <div className="product_panel panel active">
                                        <div className="featured_slider slider">
                                            <div className="border_active"/>
                                            <div onClick={this.changeDots}>
                                            <Slider ref={c => this.state.goodsSlider = c} {...this.state.goodsSliderSetting}>
                                                {
                                                    this.state.goods.map((value, key) => {
                                                        return <div key={key} value={key}
                                                            className={`product_item ${value.isNewGood ? `is_new`:``}${value.discount === 0 ? ``:`discount`} d-flex flex-column align-items-center justify-content-center text-center`}>
                                                            <div
                                                                className="product_image d-flex flex-column align-items-center justify-content-center">
                                                                <a href={`product?id=${value.id}`}><img src={value.imgs[0]} alt=""/></a></div>
                                                            <div className="product_content">
                                                                <div
                                                                    className="product_price">{getSignCurrency(this.state.currency)}
                                                                    {exchangeByCurrentCurrency(roundPriceWithDiscount(value.price['$numberDecimal'], value.discount), this.state.currency, this.state.exchangeValue)}
                                                                    {value.discount!==0 ? <span style={{textDecoration: "line-through"}}>{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(value.price['$numberDecimal'], this.state.currency, this.state.exchangeValue)}</span> : ``}
                                                                </div>
                                                                <div className="product_name">
                                                                    <div><a href={`product?id=${value.id}`}>{value.name}</a></div>
                                                                </div>
                                                                <div className="product_extras">
                                                                    <div value={value.id} onClick={this.onClickColor} className="product_color">
                                                                        {
                                                                            value.colors.map((val, k) => {
                                                                                return <input value={k} key={k} type="radio" checked
                                                                                              name="product_color"
                                                                                              style={{background: val}}
                                                                                              readOnly={true}/>
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <button value={key} onClick={this.addToCart} className="product_cart_button">{strings.addToCart}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div onClick={this.changeWishList} className={`product_fav${isInWishList(this.state.isActive, value.id) ? ` active`: ``}`}><i className="fas fa-heart"/></div>
                                                            <ul className="product_marks">
                                                                <li className="product_mark product_discount">-{value.discount}%</li>
                                                                <li className="product_mark product_new">new</li>
                                                            </ul>
                                                        </div>
                                                    })
                                                }
                                            </Slider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="popular_categories">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="popular_categories_content">
                                <div className="popular_categories_title">{strings.popularCategories}</div>
                                <div className="popular_categories_slider_nav">
                                    <div onClick={this.onPrevCategory} className="popular_categories_prev popular_categories_nav"><i
                                        className="fas fa-angle-left ml-auto"/></div>
                                    <div onClick={this.onNextCategory} className="popular_categories_next popular_categories_nav"><i
                                        className="fas fa-angle-right ml-auto"/></div>
                                </div>
                                <div className="popular_categories_link"><a href={'/shop'}>{strings.fullCatalog}</a></div>
                            </div>
                        </div>


                        <div className="col-lg-9">
                            <div className="popular_categories_slider_container">
                                <Slider ref={c => this.state.categorySlider = c} {...this.state.categorySliderSetting}>

                                    <div className="owl-item">
                                        <div
                                            className="popular_category d-flex flex-column align-items-center justify-content-center">
                                            <div className="popular_category_image"><a href={'/shop?category=phones'}><img src="assets/images/popular_1.png"
                                                                                         alt=""/></a></div>
                                            <div className="popular_category_text">{strings.phones}</div>
                                        </div>
                                    </div>

                                    <div className="owl-item">
                                        <div
                                            className="popular_category d-flex flex-column align-items-center justify-content-center">
                                            <div className="popular_category_image"><a href={'/shop?category=computerAndLaptops'}><img src="assets/images/popular_2.png"
                                                                                                                           alt=""/></a></div>
                                            <div className="popular_category_text">{strings.computerAndLaptops}</div>
                                        </div>
                                    </div>

                                    <div className="owl-item">
                                        <div
                                            className="popular_category d-flex flex-column align-items-center justify-content-center">
                                            <div className="popular_category_image"><a href={'/shop?category=computerAndLaptops'}><img src="assets/images/popular_3.png"
                                                                                                                                       alt=""/></a></div>
                                            <div className="popular_category_text">{strings.gadgets}</div>
                                        </div>
                                    </div>

                                    <div className="owl-item">
                                        <div
                                            className="popular_category d-flex flex-column align-items-center justify-content-center">
                                            <div className="popular_category_image"><a href={'/shop?category=consoles'}><img src="assets/images/popular_4.png"
                                                                                                                                       alt=""/></a></div>
                                            <div className="popular_category_text">{strings.consoles}</div>
                                        </div>
                                    </div>

                                    <div className="owl-item">
                                        <div
                                            className="popular_category d-flex flex-column align-items-center justify-content-center">
                                            <div className="popular_category_image"><a href={'/shop?category=accessories'}><img src="assets/images/popular_5.png"
                                                                                                                             alt=""/></a></div>
                                            <div className="popular_category_text">{strings.accessories}</div>
                                        </div>
                                    </div>

                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterBanner/>
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

export default MainPage;