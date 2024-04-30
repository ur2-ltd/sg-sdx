'use strict';

/**

* @module controllers/Sdx

*

*/

/* API Includes */
var Resource = require('dw/web/Resource');
var StringUtils = require('dw/util/StringUtils');
var URLUtils = require('dw/web/URLUtils');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var sdxCart = require('*/cartridge/scripts/sdx/sdxATC');

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
        var cart = app.getModel('Cart').goc();
        if(cart) {
            response.setContentType('application/json');

            let json = JSON.stringify(cart.object.allProductLineItems);
            response.writer.print(json);
        }
    } catch (error) {
        app.getView({
            message: Resource.msg(error, 'sdx_error', null)
        }).render('sdx/error');
        return;
    }
}

exports.Permalink = guard.ensure(['get', 'https'], permalink);
exports.CartItems = guard.ensure(['get', 'https'], getCartItems);
