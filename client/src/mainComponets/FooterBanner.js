import React, {Component} from 'react';
import Slider from "react-slick";
import LocalizedStrings from 'react-localization';
import localization from '../data/localization';
import StarRatings from 'react-star-ratings';
import axios from "axios";
import {getSignLanguage} from "../utils";

let strings = new LocalizedStrings(localization);

class FooterBanner extends Component {

    constructor(props) {
        super(props);
        const language = localStorage.getItem('language');
        if (!language) localStorage.setItem('language', 'Українська');
        else strings.setLanguage(language);
        this.state = {
            sliderSettings:{
                dots: false,
                arrows: false,
                infinite: true,
                speed: 1000,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplaySpeed: 3000,
                autoplay: true,
            },
            banners: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:3001/getBannerByType?type=footer')
            .then(res => this.setState({banners: res.data}))
            .catch(error => console.log(error));
    }

    render() {
        return <div className="banner_2">
            <div className="banner_2_background" style={{backgroundImage:'url(assets/images/banner_2_background.jpg)'}}/>
            <div className="banner_2_container">

                <Slider {...this.state.sliderSettings}>
                    {
                        this.state.banners.map((value, key) => {
                            return <div key={key} className="owl-item">
                                <div className="banner_2_item">
                                    <div className="container fill_height">
                                        <div className="row fill_height">
                                            <div className="col-lg-4 col-md-6 fill_height">
                                                <div className="banner_2_content">
                                                    <a href={`shop?category=${value.category}`}><div className="banner_2_category">{strings[value.category]}</div></a>
                                                    <a href={`product?id=${value.idOfProduct}`}><div className="banner_2_title">{value.name}</div></a>
                                                    <div className="banner_2_text">{value[`description-${getSignLanguage(this.state.language)}`]}
                                                    </div>
                                                    <div style={{float: 'none'}}>
                                                        <StarRatings
                                                            rating={5}
                                                            numberOfStars={5}
                                                            starSpacing='5px'
                                                            name='rating'
                                                            starDimension='25px'
                                                            starRatedColor='rgb(255, 128, 0)'
                                                        />
                                                    </div>
                                                    <div className="button banner_2_button"><a href={`product?id=${value.idOfProduct}`}>{strings.shopNow}</a></div>
                                                </div>

                                            </div>
                                            <div className="col-lg-8 col-md-6 fill_height">
                                                <div className="banner_2_image_container">
                                                    <div className="banner_2_image"><img src={value.img}
                                                                                         alt=""/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </Slider>
            </div>
        </div>
    }
}
export default FooterBanner;