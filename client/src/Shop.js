import React, {Component} from "react";
import Header from './mainComponets/Header';
import Footer from './mainComponets/Footer';
import { Helmet } from 'react-helmet';
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import axios from 'axios';
import Pagination from "react-js-pagination";
import {Link} from "react-router-dom";
import {Range} from 'rc-slider';
import 'rc-slider/dist/rc-slider.css';
import {
    getUrlParam,
    getSignCurrency,
    roundPriceWithDiscount,
    exchangeByCurrentCurrency,
    isInWishList,
    isActiveWish,
    onlyUnique,
    getSignLanguage
} from './utils';
import Slider from "react-slick";

let strings = new LocalizedStrings(localization);

class Shop extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        const currency = localStorage.getItem('currency');
        strings.setLanguage(language);
        this.state = {
            goods: [
                {
                    imgs: [],
                    price: []
                }
            ],
            goodsByFilter: [],
            currency: currency,
            volume: [20, 50],
            activePage: 1,
            currentGoods: [],
            itemsOnPage: 12,
            isActive: [],
            brands: [],
            exchangeValue: [],
            max: 0,
            min: 0,
            bestGoods: [],
            sliderSettings: {
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 4,
                slidesToScroll: 2,
                autoplaySpeed: 3000,
                autoplay: true,
            },
            sliderFilterSetting: {
                arrows: false,
                dots: true,
                infinite: false,
                vertical: true,
                verticalSwiping: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 3,
            },
            filters: {},
            checkedFilter: {},
            language: language,
            characteristics: '',
            isLoading: true,
            categories: strings.category,
            isAccessoriesComputerOrSale: false,
            subcategory: [],
            nameOfSubcategory: '',
            category: '',
            sortBy: strings.rate
        }
    }

    componentDidMount() {
        const category = getUrlParam(window.location.href, 'category');
        const brand = getUrlParam(window.location.href, 'brand');
        const name = getUrlParam(window.location.href, 'name');
        const nameOfSubcategory = getUrlParam(window.location.href, 'subcategory');
        if(nameOfSubcategory) this.setState({nameOfSubcategory: nameOfSubcategory});
        const url = `/goods/getAllGoods?${brand ? `brand=${brand}`: ``}${category ? `category=${category}`: ``}${name ?`&name=${name}`:``}`;
        axios.post(url)
            .then(res => {
                const current = this.getCurrentGoods(res.data, this.state.activePage).filter(this.filterBySybcategory);
                const range = this.getPriceRange(res.data);
                const sorted = res.data.sort(this.sortByRate);
                if(category === 'accessoriesComputer' || category === 'sale'){
                    const subcategory = res.data.map(value =>value[`subcategory-${getSignLanguage(this.state.language)}`]).filter(onlyUnique);
                    this.setState({isAccessoriesComputerOrSale: true, subcategory: subcategory, category: category});
                }
                let filters = [];
                const characteristics = `characteristics-${getSignLanguage(this.state.language)}`;
                if(category){
                    filters = res.data.filter(this.filterBySybcategory).filter((value => value[characteristics] && JSON.stringify(value[characteristics]) !== JSON.stringify({})))
                        .reduce((obj, item) => {
                            for(let key in item[characteristics]) {
                                if (!obj[key]) obj[key] = [item[characteristics][key]];
                                else obj[key] = obj[key].concat(item[characteristics][key]).filter(onlyUnique)
                            }
                            return obj;
                        }, {});
                }
                this.setState({goods: sorted, currentGoods: current, isActive: isActiveWish(this.state.isActive,current), goodsByFilter: sorted, volume: range, min: range[0], max: range[1], filters: filters, characteristics: characteristics});
            })
            .catch(err => console.log(err));
        axios.post(`/getBestGoods?size=10`)
            .then(res => this.setState({bestGoods: res.data}))
            .catch(err => console.log(err));
        axios.post(`/getAll?type=brand`)
            .then(res => this.setState({brands: res.data.result}))
            .catch(err => console.log(err));
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
            .catch(error => console.log(error));
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }



    getPriceRange = (goods) =>{
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        let tmp;
        for (let i = goods.length-1; i >= 0; i--) {
            tmp = roundPriceWithDiscount(goods[i].price["$numberDecimal"], goods[i].discount);
            if (tmp < min) min = tmp;
            if (tmp > max) max = tmp;
        }
        return [min, max]
    };

    getCurrentGoods = (goods ,pageNumber) => {
      const current = [];
      const itemsOnPage = this.state.itemsOnPage;
      for(let i = itemsOnPage * (pageNumber - 1); i<itemsOnPage * pageNumber && i<goods.length; i++) {
          current.push(goods[i]);
      }
      return current;
    };

    onChangeSlider = async (values) => {
        await this.setState({volume: values});
        this.setFiltersForCurrentGoods();
    };

    handlePageChange = (pageNumber) => {
        const current = this.getCurrentGoods(this.state.goodsByFilter ,pageNumber);
        this.setState({activePage: pageNumber, currentGoods: current, isActive: isActiveWish(this.state.isActive,current)});
    };

    changeWishList = (e) => {
        let list = [];
        const wishList = JSON.parse(localStorage.getItem('wishList'));
        if(wishList) list = wishList;
        const allClassNames = e.target.className.split(' ');
        const indexOfGoods = e.target.parentNode.getAttribute('value');

        if(allClassNames[1] !== 'active') {
            list.push({id: this.state.currentGoods[indexOfGoods].id, price: this.state.currentGoods[indexOfGoods].price["$numberDecimal"], img: this.state.currentGoods[indexOfGoods].imgs[0], name: this.state.currentGoods[indexOfGoods].name});
            localStorage.setItem('wishList', JSON.stringify(list));
            this.setState({isActive: this.state.isActive.concat({id: indexOfGoods})});
            e.target.className += ' active';
        }
        else {
            let index = -1;
            for(let i = 0; i<list.length; i++) {
                if(list[i].id === this.state.currentGoods[indexOfGoods].id)
                    index = i;
            }
            if (index > -1) {
                list.splice(index, 1);
            }
            localStorage.setItem('wishList', JSON.stringify(list));
            e.target.className = allClassNames[0];
        }
    };

    setFiltersForCurrentGoods = () => {
        const goods = this.state.goods;
        const filtered = goods.filter(this.filterByRangePrice).filter(this.filterByCharacteristics).filter(this.filterBySybcategory);
        this.setState({goodsByFilter: filtered, currentGoods: this.getCurrentGoods(filtered, 1), activePage: 1});
    };

    filterBySybcategory = (value) => {
      if(!this.state.nameOfSubcategory) return true;
      return value[`subcategory-${getSignLanguage(this.state.language)}`] === this.state.nameOfSubcategory;
    };

    filterByRangePrice = (value) => {
        const number = Number.parseInt(value.price["$numberDecimal"]) - Math.round(Number.parseInt(value.price["$numberDecimal"]) * value.discount / 100);
        return number >=  this.state.volume[0] && number <=this.state.volume[1];
    };

    changeSort = (e) => {
        const sortBy = JSON.parse(e.target.getAttribute('data-isotope-option')).sortBy;
        const goods = this.state.goodsByFilter;
        let sorted = [];
        if(sortBy === 'original-order') {
            this.setState({sortBy: strings.rate});
            sorted = goods.sort(this.sortByRate);
        } else if(sortBy === 'name'){
            this.setState({sortBy: strings.name});
            sorted = goods.sort(this.sortByName)
        } else {
            this.setState({sortBy: strings.price});
            sorted = goods.sort(this.sortByPrice);
        }
        this.setState({goodsByFilter: sorted, currentGoods: this.getCurrentGoods(sorted, 1), activePage: 1});
    };

    selectFilter = (e) => {
        const checked = e.target.checked;
        const value = e.target.parentElement.innerText;
        const key = e.target.parentElement.getAttribute('value');

        const checkedFilter = this.state.checkedFilter;

        if(checked){
            if(!checkedFilter[key])
                checkedFilter[key] = [value];
            else checkedFilter[key].push(value);
        } else {
            if(checkedFilter[key] && checkedFilter[key].length === 1)
                delete checkedFilter[key];
            else {
                const index = checkedFilter[key].indexOf(value);
                checkedFilter[key].splice(index, 1);
            }
        }
        this.setState({checkedFilter: checkedFilter}, ()=>{
            const filtered = this.state.goods.filter(this.filterByCharacteristics).filter(this.filterByRangePrice).filter(this.filterBySybcategory);
            this.setState({goodsByFilter: filtered, currentGoods: this.getCurrentGoods(filtered, 1), activePage: 1});
        });
    };

    filterByCharacteristics = (value) => {
        const checkedFilter = this.state.checkedFilter;
        const characteristics = `characteristics-${getSignLanguage(this.state.language)}`;
        if(JSON.stringify(checkedFilter) === JSON.stringify({})) return true;
        for(let key in checkedFilter) {
            for(let i = 0; i<checkedFilter[key].length; i++){
                if(value[characteristics] && value[characteristics][key] === checkedFilter[key][i])
                    return true;
            }
        }
        return false;
    };

    sortByRate = (a, b) => b.rate['$numberDecimal'] - a.rate['$numberDecimal'];

    sortByName = (a, b) => a.name.localeCompare(b.name);

    sortByPrice = (a, b) => {
      return roundPriceWithDiscount(a.price['$numberDecimal'], a.discount) - roundPriceWithDiscount(b.price['$numberDecimal'], b.discount);
    };

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}} className="super_container">
            <Helmet>
                <title>{strings.shop}</title>
                <link rel="stylesheet" type="text/css" href="assets/styles/shop_styles.css"/>
                <link rel="stylesheet" type="text/css" href="assets/styles/shop_responsive.css"/>
                <link rel="stylesheet" type="text/css" href="assets/plugins/jquery-ui-1.12.1.custom/jquery-ui.css"/>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                      integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                      crossOrigin="anonymous"/>
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            </Helmet>
            <Header/>
            <div className="shop">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">

                            <div className="shop_sidebar">
                                <div className="sidebar_section">
                                    <div className="sidebar_title">{strings.categories}</div>
                                    <ul className="sidebar_categories">
                                        <li key={0}><a href={'/shop'}>{this.state.categories['allCategories']}</a></li>
                                        {
                                            Object.keys(this.state.categories).map((keyName, i) => {
                                                if(keyName !== 'allCategories' && !this.state.isAccessoriesComputerOrSale)
                                                return <li key={i}><a style={keyName==='sale' ? {color:'red', fontWeight: 'bold'}: {}} href={`/shop?category=${keyName}`}>{this.state.categories[keyName]}</a></li>
                                            })
                                        }
                                        <h3 style={!this.state.isAccessoriesComputerOrSale ? {display: 'none'}: {}}>{this.state.category  === 'sale' ? this.state.categories['sale']: this.state.categories['accessoriesComputer']}</h3>
                                        <h5 style={!this.state.nameOfSubcategory ? {display: 'none'}: {marginLeft: '20px', fontStyle: 'italic'}}>{this.state.nameOfSubcategory}</h5>
                                        {
                                            this.state.subcategory.map((value, key) => {
                                                return <li key={key}><a href={`/shop?category=${this.state.category}&subcategory=${value}`}>{value}</a></li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="sidebar_section filter_by_section">
                                    <div className="sidebar_title">{strings.filterBy}:</div>
                                    <div style={this.state.currentGoods.length === 0 ? {display: 'none'} : {marginBottom: "20px"}} className="sidebar_subtitle">{strings.price}</div>
                                    <div className="isotope">
                                        <div style={this.state.currentGoods.length === 0 ? {display: 'none'} : {}} data-role="rangeslider">
                                            <Range
                                                max={this.state.max}
                                                min={this.state.min}
                                                value={this.state.volume}
                                                onChange={this.onChangeSlider}
                                                pushable={true}
                                            />
                                            <p>Range: </p>
                                            <p style={{marginTop: '-10px'}}>{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(this.state.volume[0],this.state.currency, this.state.exchangeValue)} -
                                                 {getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(this.state.volume[1],this.state.currency, this.state.exchangeValue)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sidebar_section"/>
                                    {Object.keys(this.state.filters).map((keyName, i) => {
                                        return <div style={this.state.isAccessoriesComputerOrSale && !this.state.nameOfSubcategory ? {display: 'none'} : {}} key={i} className={'filters'}>
                                            <h4>{keyName}</h4>
                                            <Slider {...this.state.sliderFilterSetting}>
                                                {this.state.filters[keyName].map((value, key) => {
                                                    return <div value={keyName} key={key} className="form-check">
                                                        <input onChange={this.selectFilter} className="form-check-input" type="checkbox" value=""/>
                                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                                            {value}
                                                        </label>
                                                    </div>
                                                })}
                                            </Slider>
                                        </div>
                                    })}
                                <div className="sidebar_section">
                                    <div className="sidebar_subtitle brands_subtitle">Brands</div>
                                    <ul className="brands_list">
                                        {
                                            this.state.brands.map((value) => {
                                              return <li key={value} className="brand"><a href={`/shop?brand=${value}`}>{value}</a></li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div className="col-lg-9">
                            <div className="shop_content">
                                <div className="shop_bar clearfix">
                                    <div className="shop_product_count"><span>{this.state.goodsByFilter.length}</span> {strings.productsFound}</div>
                                    <div className="shop_sorting">
                                        <span>{strings.sortBy}:</span>
                                        <ul>
                                            <li>
                                                <span className="sorting_text">{this.state.sortBy}<i className="fas fa-chevron-down"/></span>
                                            <ul>
                                                <li className="shop_sorting_button" onClick={this.changeSort} data-isotope-option='{ "sortBy": "original-order" }'>{strings.rate}</li>
                                                <li className="shop_sorting_button" onClick={this.changeSort} data-isotope-option='{ "sortBy": "name" }'>{strings.name}</li>
                                                <li className="shop_sorting_button" onClick={this.changeSort} data-isotope-option='{ "sortBy": "price" }'>{strings.price}</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="product_grid">
                                <div className="product_grid_border"/>
                                    <div style={this.state.goodsByFilter.length !== 0 ? {display: 'none'} : {}}>
                                        <h3 style={{fontWeight: 'bold'}}>{strings.notFound}</h3>
                                    </div>
                                {this.state.currentGoods.map((value, key) => {
                                    return <div key={key} value={key} className={`product_item${value.isNewGood ? ` is_new`:``}${value.discount === 0 ? ``:` discount`}`}>
                                            <div className="product_border"/>
                                            <div className="product_image d-flex flex-column align-items-center justify-content-center"><Link to={`/product?id=${value.id}`}><img src={value.imgs[0]} alt=""/></Link></div>
                                            <div className="product_content">
                                                <div className="product_price">{getSignCurrency(this.state.currency)}
                                                {exchangeByCurrentCurrency(roundPriceWithDiscount(value.price['$numberDecimal'], value.discount), this.state.currency, this.state.exchangeValue)}
                                                {value.discount!==0 ? <span>{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(value.price['$numberDecimal'], this.state.currency, this.state.exchangeValue)}</span> : ``}</div>
                                                <div className="product_name"><div><Link to={`/product?id=${value.id}`} tabIndex="0">{value.name}</Link></div></div>
                                            </div>
                                            <div onClick={this.changeWishList} className={`product_fav${isInWishList(this.state.isActive,value.id) ? ` active`: ``}`}><i className="fas fa-heart"/></div>
                                            <ul className="product_marks">
                                                <li className="product_mark product_discount">-{value.discount}%</li>
                                                <li className="product_mark product_new">new</li>
                                            </ul>
                                        </div>
                                })}
                            </div>
                                <div style={{marginTop: '150px', clear: 'both'}} className={`${this.state.goodsByFilter.length <= this.state.itemsOnPage ? `hidden`: ``}`}>
                                    <Pagination
                                        activePage={this.state.activePage}
                                        prevPageText='prev'
                                        nextPageText='next'
                                        firstPageText='first'
                                        lastPageText='last'
                                        itemsCountPerPage={this.state.itemsOnPage}
                                        totalItemsCount={this.state.goodsByFilter.length}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange}
                                    />
                                </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>


        <div className="viewed">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="viewed_title_container">
                            <h3 className="viewed_title">{strings.popular}</h3>
                        </div>

                        <Slider {...this.state.sliderSettings}>

                            { this.state.bestGoods.map((value, key) => {
                                if(!value) return <div key={key} className={""}/>;
                                    return <div key={key} className="owl-carousel owl-theme viewed_slider">
                                      <div className="owl-item">
                                          <div className={`viewed_item ${value.isNewGood ? `is_new`:``}${value.discount === 0 ? ``:`discount`} d-flex flex-column align-items-center justify-content-center text-center`}>
                                              <div className="viewed_image"><a href={`/product?id=${value.id}`}><img src={value.imgs[0]} alt=""/></a></div>
                                              <div className="viewed_content text-center">
                                                  <div className="viewed_price">{getSignCurrency(this.state.currency)}
                                                      {exchangeByCurrentCurrency(roundPriceWithDiscount(value.price['$numberDecimal'], value.discount), this.state.currency, this.state.exchangeValue)}
                                                      {value.discount!==0 ? <span>{getSignCurrency(this.state.currency)}{exchangeByCurrentCurrency(value.price['$numberDecimal'], this.state.currency, this.state.exchangeValue)}</span> : ``}</div>
                                                  <div className="viewed_name"><a href={`/product?id=${value.id}`}>{value.name}</a></div>
                                              </div>
                                              <ul className="item_marks">
                                                  <li className="item_mark item_discount">-${value.discount}%</li>
                                                  <li className="item_mark item_new">new</li>
                                              </ul>
                                          </div>
                                      </div>
                                  </div>
                            })
                            }
                        </Slider>
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

export default Shop;