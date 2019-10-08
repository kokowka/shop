import React, {Component} from "react";
import LocalizedStrings from 'react-localization';
import localization from '../data/localization';

let strings = new LocalizedStrings(localization);

class Footer extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        this.state = {
            categories: strings.category
        }
    }

    render() {
        return <footer className="footer">
            <div className="container">
                <div className="row">

                    <div className="col-lg-3 footer_col">
                        <div className="footer_column footer_contact">
                            <div className="logo_container">
                                <div className="logo"><a href={'/shop'}>Bazar Shop</a></div>
                            </div>
                            <div className="footer_title">{strings.question}</div>
                            <div className="footer_phone">+380930559464</div>
                            <div className="footer_contact_text">
                                <p>{strings.location}</p>
                                <p>{strings.district}</p>
                            </div>
                            <div className="footer_social">
                                <ul>
                                    <li><a href={"https://www.facebook.com/"}><i className="fab fa-facebook-f"/></a></li>
                                    <li><a href={"https://www.youtube.com/"}><i className="fab fa-youtube"/></a></li>
                                    <li><a href={"https://www.google.com/"}><i className="fab fa-google"/></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-2 offset-lg-2">
                        <div className="footer_column">
                            <div className="footer_title">{strings.findFast}</div>
                            <ul className="footer_list">
                                {
                                    Object.keys(this.state.categories).splice(0, 6).map((keyName, i) => {
                                        if(keyName !=='allCategories')
                                        return <li key={i}><a href={`/shop?category=${keyName}`}>{this.state.categories[keyName]}</a></li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-2">
                        <div className="footer_column">
                            <ul className="footer_list footer_list_2">
                                {
                                    Object.keys(this.state.categories).splice(6).map((keyName, i) => {
                                        return <li key={i}><a href={`/shop?category=${keyName}`}>{this.state.categories[keyName]}</a></li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-2">
                        <div className="footer_column">
                            <div className="footer_title">{strings.customerCare}</div>
                            <ul className="footer_list">
                                <li><a href={'/wishList'}>{strings.wishList}</a></li>
                                <li><a href={'/contact'}>{strings.contact}</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    }
}

export default Footer;