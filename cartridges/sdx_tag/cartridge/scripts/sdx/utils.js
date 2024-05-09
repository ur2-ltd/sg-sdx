'use strict';

/* API Includes */
var Transaction = require('dw/system/Transaction');
var BasketMgr = require('dw/order/BasketMgr');
var PromotionMgr = require('dw/campaign/PromotionMgr');

function clearCart() {
    var currentBasket = BasketMgr.getCurrentBasket();
    if (currentBasket) {
        Transaction.wrap(function () {
            var productLineItems = currentBasket.getAllProductLineItems();
            for (var i = 0; i < productLineItems.length; i++) {
                var item = productLineItems[i];
                currentBasket.removeProductLineItem(item);
            }
        });
        currentBasket.updateTotals();
        PromotionMgr.applyDiscounts(currentBasket);
    }
}

function updateOptions(params, product) {
    var optionModel = product.getOptionModel();

    for (var i = 0; i < params.options.length; i++) {
        var optionID = params.options[i]['Option ID'];
        var optionValueID = params.options[i]['Option Value ID'];

        if (optionValueID) {
            var option = optionModel.getOption(optionID);

            if (option && optionValueID) {
                var optionValue = optionModel.getOptionValue(option, optionValueID);
                if (optionValue) {
                    optionModel.setSelectedOptionValue(option, optionValue);
                }
            }
        }
    }

    return optionModel;
}


module.exports = {
    clearCart     : clearCart,
    updateOptions : updateOptions
};
