'use strict';

/* API Includes */
var PromotionMgr = require('dw/campaign/PromotionMgr');

function clearCart(cartObj) {
    for (var i = cartObj.allProductLineItems.length - 1; i >= 0; i--) {
        cartObj.removeProductLineItem(cartObj.allProductLineItems[i]);
    }

    cartObj.updateTotals();
    PromotionMgr.applyDiscounts(cartObj);
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
