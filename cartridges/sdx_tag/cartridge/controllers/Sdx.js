'use strict';

/**

* @module controllers/Sdx

*

*/

/* API Includes */
var Resource = require('dw/web/Resource');
var StringUtils = require('dw/util/StringUtils');
var URLUtils = require('dw/web/URLUtils');
var BasketMgr = require('dw/order/BasketMgr');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var sdxCart = require('*/cartridge/scripts/sdx/sdxATC');
var sdxUtils = require('*/cartridge/scripts/sdx/utils');

function permalink() {
    try {
        var cart = app.getModel('Cart').goc();
        var items = request.httpParameterMap.items ? JSON.parse(StringUtils.decodeBase64(request.httpParameterMap.items)) : null;
    } catch (error) {
        app.getView({
            message: Resource.msg('rebuildcart.message.error.general1', 'sdx_error', null)
        }).render('sdx/error');
        return;
    }

    if (!cart || !items || !items.length) {
        app.getView({
            message: Resource.msg('rebuildcart.message.error.general2', 'sdx_error', null)
        }).render('sdx/error');
        return;
    }

    // Clear cart
    try {
        sdxUtils.clearCart();
    } catch (error) {
        //error
    }

    // Add new products based on the items received on the URL params
    var renderInfo = sdxCart.addProductToCart(items, cart);

    if (renderInfo.error) {
        app.getView({
            message: Resource.msg('rebuildcart.message.error.general3', 'sdx_error', null)
        }).render('sdx/error');
        return;
    }

    if (renderInfo.template === 'checkout/cart/cart') {
        app.getView('Cart', {
            Basket: cart
        }).render(renderInfo.template);
    } else if (renderInfo.format === 'ajax') {
        app.getView('Cart', {
            cart: cart,
            BonusDiscountLineItem: renderInfo.BonusDiscountLineItem
        }).render(renderInfo.template);
    } else {
        response.redirect(URLUtils.url('Cart-Show'));
    }
}

function getCartItems() {
    try {
        var currentBasket = BasketMgr.getCurrentBasket();
        var cartItems = [];

        if (currentBasket) {
            var basketItems = currentBasket.getProductLineItems().toArray();
            for (var itemIndex = 0; itemIndex < basketItems.length; itemIndex++) {
                var lineItem = basketItems[itemIndex];
                var currentProductID = lineItem.productID;

                var currentLineItem = {
                    productID: currentProductID,
                    quantity: lineItem.quantity.value
                };

                cartItems.push(currentLineItem);
            }
        }

        let json = JSON.stringify({
            cartItems,
            status: 200
        });

        response.setContentType('application/json');
        response.writer.print(json);

    } catch (error) {
        response.setContentType('application/json');
        response.writer.print(JSON.stringify({
            status: 500,
            error: error
        }));
    }
}

exports.Permalink = guard.ensure(['get', 'https'], permalink);
exports.CartItems = guard.ensure(['get', 'https'], getCartItems);
