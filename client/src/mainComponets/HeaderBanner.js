import React, {Component} from 'react';

import LocalizedStrings from 'react-localization';
import localization from '../data/localization';
import axios from "axios";
import {getSignLanguage} from "../utils";
import Slider from "react-slick";

let strings = new LocalizedStrings(localization);

class HeaderBanner extends Component{

    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        const currency = localStorage.getItem('currency');
        this.state = {
            banner: [],
            exchangeValue: [],
            currency: currency,
            language: language,
            sliderSettings:{
                dots: false,
                arrows: false,
                infinite: true,
                speed: 5000,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplaySpeed: 6000,
                autoplay: true,
                imgWidth: '25.000em',
                imgHeight: '25.000em',
                initialSlide: 0
            },
            isLoading: true
        }
    }

    componentDidMount() {
        axios.post(`/getBannerByType?type=header`)
            .then(res => {if(res.data[0]) this.setState({banner: res.data})})
            .catch(error => console.log(error));
        axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
            .then(result => {
                this.setState({exchangeValue: result.data})
            })
            .catch(error => console.log(error));
        window.addEventListener("resize", this.resize);
        this.resize();
        setTimeout(() =>this.setState({isLoading: false}), 675)
    }

    resize = () => {
        const sizeSmall = window.innerWidth <= 770 && window.innerWidth > 580;
        const soSmall =  window.innerWidth <= 580;
        if(sizeSmall)
            this.setState({
                imgWidth: '12.500em',
                imgHeight: '12.500em',
                marginTop: '500px',
                width: '75%',
                rowMargin: '0'
            });
        else if(soSmall) {
            this.setState({
                imgWidth: '6.250em',
                imgHeight: '6.250em',
                marginTop: '200px',
                width: '100%',
                rowMargin: '0'
            });
        }
        else {
            this.setState({
                imgWidth: '26.000em',
                imgHeight: '26.000em',
                marginTop: '20px',
                width: '75%',
                rowMargin: '250px'
            });
        }

    };

    render() {
        return <div style={this.state.isLoading? {marginTop: '300px'} : {}}>
                <div style={this.state.isLoading? {display: 'none'} : {width: this.state.width}} className="banner">
                    <Slider {...this.state.sliderSettings}>
                        {this.state.banner.map((value, key) => {
                            return <div key={key}>
                                <div className="banner_background"/>
                                <a href={`/product?id=${value.idOfProduct}`}>
                                <div className="container fill_height">
                                    <div style={{marginRight: this.state.rowMargin}} className="row fill_height">
                                        <div className="banner_product_image"><img style={{maxWidth: this.state.imgWidth,
                                            maxHeight: this.state.imgHeight, marginTop: this.state.marginTop }} src={value.img} alt=""/></div>
                                        <div className="col-lg-5 offset-lg-4 fill_height">
                                            <div className="banner_content">
                                                <h1 className="banner_text">{value[`description-${getSignLanguage(this.state.language)}`]}</h1>
                                                <a href={`/product?id=${value.idOfProduct}`}><div className="banner_product_name">{value.name}</div></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </a>
                            </div>
                        })}
                    </Slider>
                </div>


                <div className="characteristics">
                    <div className="container">
                        <div className="row">

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_1.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.freeDelivery}</div>
                                        <div className="char_subtitle">{strings.from} $1000</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_2.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.service}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_3.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.prepayment}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 char_col">

                                <div className="char_item d-flex flex-row align-items-center justify-content-start">
                                    <div className="char_icon"><img src="assets/images/char_4.png" alt=""/></div>
                                    <div className="char_content">
                                        <div className="char_title">{strings.quality}</div>
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