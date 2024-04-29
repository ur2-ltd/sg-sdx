'use strict';

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var recreateHelpers = require('*/cartridge/scripts/sdx/recreateCartHelpers');

function addProductToCart(decodedItems, cartObj) {
    try {
        var productList = decodedItems.length ? decodedItems : null;
        var cart = cartObj;

        if (cart.object.allProductLineItems.length) {
            recreateHelpers.clearCart(cart.object);
        }

        var params = request.httpParameterMap;
        var format = params.hasOwnProperty('format') && params.format.stringValue ? params.format.stringValue.toLowerCase() : '';
        var newBonusDiscountLineItem;
        var Product = app.getModel('Product');
        var productOptionModel;
        var productToAdd;
        var template = 'checkout/cart/minicart';

        for (var i = 0; i < productList.length; i++) {
            productToAdd = Product.get(productList[i].productID);
            productOptionModel = productToAdd ? recreateHelpers.updateOptions(productList[i], productToAdd.object) : null;
            cart.addProductItem(productToAdd.object, productList[i].quantity, productOptionModel);
        }

        return {
            format                : format,
            template              : template,
            BonusDiscountLineItem : newBonusDiscountLineItem
        };
    } catch (error) {
        return {
            success      : false,
            error        : true,
            errorMessage : `ERROR - Please check the encoded obj for any unexpected chars or syntax issues. ${error.message}`
        };
    }
}

/*
 * Module exports
 */
module.exports = {
    addProductToCart: addProductToCart
};
