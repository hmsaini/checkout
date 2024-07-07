const catalog = require('./catalog/products');
const offers = require('./catalog/offers');

class Checkout {
    constructor(offers) {
        this.offers = offers;
        this.products = [];
    }

    scan(product) {
        if (product) {
            this?.products?.push(product);
        }
    }

    totalPrice() {
        try {
            let productCounts = {};
            for (let i = 0; i < this?.products?.length; i++) {
                if (productCounts[this?.products[i]]) {
                    productCounts[this?.products[i]]++;
                } else {
                    productCounts[this?.products[i]] = 1;
                }
            }
            // console.log(productCounts);

            let totalCost = 0;
            for (let i = 0; i < Object.keys(productCounts)?.length; i++) {
                let price = this.getPrice(Object.keys(productCounts)[i], Object.values(productCounts)[i]);
                if (price) {
                    totalCost += price;
                }
            }
            return parseFloat(totalCost)?.toFixed(2);
        } catch (err) {
            console.log(`totalPrice failed - ${err}`);
            return 0;
        }
    }

    getPrice(sku, qty) {
        try {
            let productDetails = catalog.filter(ele => ele?.sku == sku)?.shift() || null;
            if (!productDetails) {
                console.log(`SKU: ${sku} is not found in the catalog`);
                return 0;
            }

            let price = productDetails?.price;
            let availableOffer = this?.offers?.filter(ele => ele?.skus?.includes(sku))?.shift() || null;
            if (availableOffer && qty >= availableOffer?.minQty) {
                if (availableOffer?.offerName == 'buy 3 for 2 deal') {
                    let payForQty = Math.floor(qty / availableOffer?.minQty) * 2;
                    return price * payForQty;
                } else if (availableOffer?.offerName == 'bulk discount') {
                    return availableOffer?.discountPrice * qty;
                } 
            } else {
                return price * qty;
            } 
        } catch (err) {
            console.log(`getPrice failed - ${err}`);
            return 0;
        }
    }
}

const obj1 = () => {
    const co = new Checkout(offers);
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('vga');

    console.log(`Total expected: $${co.totalPrice()}`);
}
obj1();

const obj2 = () => {
    const co = new Checkout(offers);
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('atv');
    co.scan('ipd');
    co.scan('ipd');
    co.scan('ipd');

    console.log(`Total expected: $${co.totalPrice()}`);
};
obj2();

const obj3 = () => {
    const co = new Checkout(offers);
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');
    co.scan('atv');

    console.log(`Total expected: $${co.totalPrice()}`);
};
obj3();