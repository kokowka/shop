import React, {Component} from "react";
import {Helmet} from "react-helmet";
import Header from "./mainComponets/Header";
import Footer from "./mainComponets/Footer";
import LocalizedStrings from 'react-localization';
import localization from './data/localization';
import axios from "axios";
import {getSignLanguage, isActiveWish, makeSmallerStr} from "./utils";
import Interweave from "interweave";
import Pagination from "react-js-pagination";

let strings = new LocalizedStrings(localization);

class Blog extends Component{
    constructor(props) {
        super(props);
        const language = localStorage.getItem('language') || 'Українська';
        strings.setLanguage(language);
        this.state = {
            isLoading: true,
            posts:[],
            language: language,
            itemsOnPage: 9,
            activePage: 1,
            currentPosts: []
        }
    }

    componentDidMount() {
        axios.post(`/getPosts`)
            .then(result => {
                const posts = result.data.reverse();
                const current = this.getCurrentPosts(posts, this.state.activePage);
                this.setState({posts: posts, currentPosts: current})
            })
            .catch(error => console.log(error));
        setTimeout(() =>this.setState({isLoading: false}), 400)
    }

    handlePageChange = (pageNumber) => {
        const posts = this.getCurrentPosts(this.state.posts ,pageNumber);
        this.setState({activePage: pageNumber, currentPosts: posts});
    };

    getCurrentPosts = (posts, pageNumber) => {
        const current = [];
        const itemsOnPage = this.state.itemsOnPage;
        for(let i = itemsOnPage * (pageNumber - 1); i<itemsOnPage * pageNumber && i<posts.length; i++) {
            current.push(posts[i]);
        }
        return current;
    };

    render() {
        return <div style={this.state.isLoading? {display: 'none'} : {}}>
            <Helmet>
                <link rel="stylesheet" type="text/css" href="assets/styles/blog_styles.css"/>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                      integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                      crossOrigin="anonymous"/>
            </Helmet>
            <Header/>
            <div className="home">
                <div className="home_background parallax-window" data-parallax="scroll"
                     data-image-src="assets/images/shop_background.jpg"/>
                <div className="home_overlay"/>
                <div className="home_content d-flex flex-column align-items-center justify-content-center">
                    <h2 className="home_title">{strings.blog}</h2>
                </div>
            </div>
            <div className="blog">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {
                                this.state.currentPosts.map((value, key) => {
                                    return <div key={key} className="blog_posts d-flex flex-row align-items-start justify-content-between">

                                        <div className="blog_post">
                                            <div className="blog_image" style={{backgroundImage:`url(${value.img})`}}/>
                                            <div className="blog_text"> <Interweave
                                                content= {makeSmallerStr(value[`text-${getSignLanguage(this.state.language)}`], 100, true)}/>
                                            </div>
                                            <div className="blog_button"><a href={`/info?type=blog&id=${value.id}`}>{strings.continue}</a></div>
                                        </div>


                                    </div>
                                })
                            }
                            <div style={{clear:'both'}} className={`${this.state.posts.length <= this.state.itemsOnPage ? `hidden`: ``}`}>
                                <Pagination
                                    activePage={this.state.activePage}
                                    prevPageText='prev'
                                    nextPageText='next'
                                    firstPageText='first'
                                    lastPageText='last'
                                    itemsCountPerPage={this.state.itemsOnPage}
                                    totalItemsCount={this.state.posts.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                />
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
        </div>
    }
}

export default Blog;