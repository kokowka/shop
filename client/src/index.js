import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './MainPage';
import Register from './Register';
import SingIn from './SingIn';
import AddGoods from './AddGoods';
import Product from './Product';
import Cart from './Cart';
import Contact from './Contact';
import WishList from './WishList';
import Shop from './Shop';
import AddBanner from './AddBanner';
import UpdateGoods from './UpdateGoods';
import NotFound from './NotFound';
import InfoPage from './InfoPage';
import AddInfo from './AddInfo';
import Blog from './Blog';
import AddPost from './AddPost';

const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={MainPage} />
            <Route path={"/register"} component={Register}/>
            <Route path={"/singIn"} component={SingIn}/>
            <Route path={"/add"} component={AddGoods}/>
            <Route path={"/addBanner"} component={AddBanner}/>
            <Route path={"/product"} component={Product}/>
            <Route path={"/cart"} component={Cart}/>
            <Route path={"/contact"} component={Contact}/>
            <Route path={"/wishList"} component={WishList}/>
            <Route path={"/shop"} component={Shop}/>
            <Route path={"/update"} component={UpdateGoods}/>
            <Route path={"/info"} component={InfoPage}/>
            <Route path={"/addInfo"} component={AddInfo}/>
            <Route path={"/blog"} component={Blog}/>
            <Route path={"/addPost"} component={AddPost}/>
            <Route path="*" component={NotFound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));


