function getUrlParam(href, param) {
    const url = new URL(href);
    return  url.searchParams.get(param);
}

function getSignCurrency(currency) {
    switch (currency) {
        case '$ US dollar': return ' $ ';
        case '₽ Рубль': return ' ₽ ';
        default: return ' ₴ ';
    }
}

function getSignLanguage(language) {
    switch (language) {
        case 'English': return 'en';
        case 'Русский': return 'ru';
        default: return 'ua';
    }
}

function roundPriceWithDiscount(price, discount) {
    price = Number.parseInt(price);
    return Math.round(price - price * discount / 100);
}

function exchangeByCurrentCurrency(price, currency, exchangeValue) {
    if(currency === "₴ Гривня" || exchangeValue.length === 0) return price;
    else if(currency === "₽ Рубль") return Math.round((price / exchangeValue[2].buy));
    else return Math.round((price / exchangeValue[0].buy));
}

function isInWishList(wishList, id) {
    for (let i = 0; i < wishList.length; i++) {
        if (wishList[i].id === id)
            return true;
    }
    return false;
}

function isActiveWish(wishArr, currentGoods) {
    const isActiveWish = wishArr;
    const wishList = JSON.parse(localStorage.getItem('wishList')) || [];
    for(let i = 0; i<currentGoods.length; i++) {
        for(let j =0; j<wishList.length; j++) {
            if (wishList[j].id === currentGoods[i].id)
                isActiveWish.push({id: currentGoods[i].id});
        }
    }
    return isActiveWish
}

export {
    getUrlParam,
    getSignCurrency,
    roundPriceWithDiscount,
    exchangeByCurrentCurrency,
    getSignLanguage,
    isInWishList,
    isActiveWish
}