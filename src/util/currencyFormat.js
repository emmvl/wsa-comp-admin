// function for returning currency format text number
function currencyFormat(data) {
    const currencyFormatter = require('currency-formatter');
    return currencyFormatter.format(data, { code: 'USD' });
}

module.exports = { currencyFormat };
