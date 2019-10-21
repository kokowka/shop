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
    if(exchangeValue.length === 0) return price;
    if(currency === "₴ Гривня") return Math.round((price * parseFloat(exchangeValue[0].sale).toFixed(1)));
    else return price;
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function makeSmallerStr(str, max, isHtml = false) {
    if(str.length > max) {
        let res = str.split('').splice(0, max).join('') + '...';
        if(isHtml) res +='</p>';
        return res;
    }
    return str;
}

function getRating (rates) {
    let sum = 0;
    const length = rates.length;
    if(length === 0) return 0;
    for(let i = 0; i<length; i++)
        sum += rates[i];
    return sum / length;
}

export {
    getUrlParam,
    getSignCurrency,
    roundPriceWithDiscount,
    exchangeByCurrentCurrency,
    getSignLanguage,
    isInWishList,
    isActiveWish,
    onlyUnique,
    makeSmallerStr,
    getRating
}