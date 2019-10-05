import React, {Component} from "react";
import LocalizedStrings from 'react-localization';
import localization from '../data/localization';

let strings = new LocalizedStrings(localization);

class Footer extends Component {
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language');
        strings.setLanguage(language);
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
                                <li><a href={'/shop?type=laptop'}>{strings.computerAndLaptops}</a></li>
                                <li><a href={'/shop?type=cameras'}>{strings.cameras}</a></li>
                                <li><a href={'/shop?type=hardware'}>{strings.hardware}</a></li>
                                <li><a href={'/shop?type=phones'}>{strings.phones}</a></li>
                                <li><a href={'/shop?type=tv'}>{strings.tv}</a></li>
                                <li><a href={'/shop?type=strings.gadgets'}>{strings.gadgets}</a></li>
                                <li><a href={'/shop?type=electronics'}>{strings.electronics}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-2">
                        <div className="footer_column">
                            <ul className="footer_list footer_list_2">
                                <li><a href={'/shop?type=consoles'}>{strings.consoles}</a></li>
                                <li><a href={'/shop?type=accessories'}>{strings.accessories}</a></li>
                                <li><a href={'/shop?type=cameras'}>{strings.cameras}</a></li>
                                <li><a href={'/shop?type=hardware'}>{strings.hardware}</a></li>
                                <li><a href={'/shop?type=laptop'}>{strings.computerAndLaptops}</a></li>
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