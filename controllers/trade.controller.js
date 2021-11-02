const { Trade } = require('../model/trade.model')
const { Sequelize } = require("sequelize");

/**
 * Get buy trades filtered by symbol
 * @param {string} symbol the symbol of trade
 * @returns Promise the queried trade list
 */
exports.getBuyTrades = async (symbol) => {
    return await getTradesByType(symbol, false);
}

/**
 * Get sell trades filtered by symbol
 * @param {string} symbol the symbol of trade
 * @returns Promise the queried trade list
 */
exports.getSellTrades = async (symbol) => {
    return await getTradesByType(symbol, true);
}

/**
 * Calcul benefits realized by all trades
 * @param {*} symbol the symbol to analyze
 * @returns Promise the benefits (loses if negative)
 */
exports.getBenefits = async (symbol) => {

    const buys = await this.getBuyTrades(symbol);
    const sells = await this.getSellTrades(symbol);
    let benefits = 0;
    let index = 0;

    sells.forEach(sell => {
        while (sell.amount > 0) {
            if (sell.amount > buys[index].amount) {
                // If sell amount is bigger than buy one we use the buy amount for the calcul and reduce sell amount
                benefits += buys[index].amount * sell.price - buys[index].amount * buys[index].price;
                // We reduce the sell amount for next loop
                sell.amount -= buys[index].amount;
                // We go to nex buy because we consumed this one by uses his maximum amount
                index++;
            } else {
                // If buy amount is bigger than sell one we use the sell amount for the calcul and reduce buy amount
                benefits += sell.amount * sell.price - sell.amount * buys[index].price;
                // We reduce buy amount for next sells calcul
                buys[index].amount -= sell.amount;
                // If we consumed the buy we go to next
                if (buys[index].amount) index++;
                // We just consumed the sell by uses his maximum amount
                sell.amount = 0;
            }
            if (sell.amount < (1 / (10 ^ 12))) sell.amount = 0;
        }
    });

    return benefits;
}

/**
 * Calcul benefits for all symbols
 * @returns Promise the benefices (loses if negative)
 */
exports.getAllBenefits = async () => {
    symbols = await this.getSymbols();

    let benefits = 0;

    for (let symbol of symbols) {
        temp = await this.getBenefits(symbol);
        benefits += temp;
    }

    return benefits;
}

/**
 * Get alls the symbols
 * @returns Promise the symbols
 */
exports.getSymbols = async () => {
    return (await Trade.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('symbol')), 'symbol'],
        ]
    })).map(symbol => symbol.symbol);
}

/**
 * Calcul average price for a symbol
 * @param {*} symbol the symbol to analyze
 * @returns Promise the average price for this symbol
 */
exports.getAveragePrice = async (symbol) => {
    const buys = await this.getBuyTrades(symbol);
    const sells = await this.getSellTrades(symbol);
    let index = 0;

    sells.forEach(sell => {
        while (sell.amount > 0) {
            if (sell.amount > buys[index].amount) {
                // We reduce the sell amount for next loop
                sell.amount -= buys[index].amount;
                // We go to nex buy because we consumed this one by uses his maximum amount
                index++;
            } else {
                // We reduce buy amount for next sells calcul
                buys[index].amount -= sell.amount;
                // If we consumed the buy we go to next
                if (buys[index].amount) index++;
                // We just consumed the sell by uses his maximum amount
                sell.amount = 0;
            }
            if (sell.amount < (1 / (10 ^ 12))) sell.amount = 0;
        }
    });

    let totalAmount = 0;
    let totalPrice = 0;

    for (; index < buys.length; index++) {
        totalAmount += buys[index].amount;
        totalPrice += buys[index].amount * buys[index].price
    }

    return totalPrice / totalAmount;
}

/**
 * Get trades filtered by symbol and type
 * isSell false = buy trade
 * isSell true = sell trade
 * @param {string} symbol the symbol of trade
 * @param {boolean} isSell the sell marker
 * @returns Promise the queried trade list
 */
async function getTradesByType(symbol, isSell) {
    return await Trade.findAll({
        where: {
            symbol: symbol,
            sell: isSell
        },
        order: [
            ['timestamp', 'ASC'],
        ]
    })
}

/**
 * Get the actual amount for a symbol
 * @param {*} symbol the symbol to analyze
 * @returns Promise the actual amount for the symbol
 */
exports.getActualAmount = async (symbol) => {
    const buys = await this.getBuyTrades(symbol);
    const sells = await this.getSellTrades(symbol);
    let index = 0;

    sells.forEach(sell => {
        while (sell.amount > 0) {
            if (sell.amount > buys[index].amount) {
                // We reduce the sell amount for next loop
                sell.amount -= buys[index].amount;
                // We go to nex buy because we consumed this one by uses his maximum amount
                index++;
            } else {
                // We reduce buy amount for next sells calcul
                buys[index].amount -= sell.amount;
                // If we consumed the buy we go to next
                if (buys[index].amount) index++;
                // We just consumed the sell by uses his maximum amount
                sell.amount = 0;
            }
            if (sell.amount < (1 / (10 ^ 12))) sell.amount = 0;
        }
    });

    let actualAmount = 0;

    for (; index < buys.length; index++) {
        actualAmount += buys[index].amount;
    }

    return actualAmount;
}

/**
 * Get the actual money invested for a symbol
 * @param {*} symbol the symbol to analyze
 * @returns Promise the actual money invested for the symbol
 */
exports.getActualInvested = async (symbol) => {
    averagePrice = await this.getAveragePrice(symbol);
    actualAmount = await this.getActualAmount(symbol);
    return averagePrice * actualAmount;
}

/**
 * Get the actual money invested for all symbols
 * @returns Promise the full money invested
 */
exports.getAllActualInvested = async () => {
    symbols = await this.getSymbols();

    let actualInvested = 0;

    for (let symbol of symbols) {
        temp = await this.getActualInvested(symbol);
        actualInvested += temp;
    }

    return actualInvested;
}

/**
 * Get benefits if sell all symbol at a defined price
 * @param {*} symbol the symbol to analyze
 * @param {*} price the sell price
 */
exports.simulateFullSell = async (symbol, price) => {
    const amountToSell = await this.getActualAmount(symbol);
    return await this.simulateSell(symbol, price, amountToSell);
}

/**
 * Get benefits of a potentially sell is done at a defined price
 * @param {*} symbol the symbol to analyze
 * @param {*} price the sell price
 * @param {*} amount the amount sell
 */
exports.simulateSell = async (symbol, price, amount) => {
    const buys = await this.getBuyTrades(symbol);
    const sells = await this.getSellTrades(symbol);
    let index = 0;

    sells.forEach(sell => {
        while (sell.amount > 0) {
            if (sell.amount > buys[index].amount) {
                // We reduce the sell amount for next loop
                sell.amount -= buys[index].amount;
                // We go to nex buy because we consumed this one by uses his maximum amount
                index++;
            } else {
                // We reduce buy amount for next sells calcul
                buys[index].amount -= sell.amount;
                // If we consumed the buy we go to next
                if (buys[index].amount) index++;
                // We just consumed the sell by uses his maximum amount
                sell.amount = 0;
            }
        }
        if (sell.amount < (1 / (10 ^ 12))) sell.amount = 0;
    });

    // Now FIFO skipped, calcul benefit of this trade

    let benefits = 0;

    while (amount > 0) {
        if (amount > buys[index].amount) {
            // If sell amount is bigger than buy one we use the buy amount for the calcul and reduce sell amount
            benefits += buys[index].amount * price - buys[index].amount * buys[index].price;
            // We reduce the sell amount for next loop
            amount -= buys[index].amount;
            // We go to nex buy because we consumed this one by uses his maximum amount
            index++;
        } else {
            // If buy amount is bigger than sell one we use the sell amount for the calcul and reduce buy amount
            benefits += amount * price - amount * buys[index].price;
            // We reduce buy amount for next sells calcul
            buys[index].amount -= amount;
            // If we consumed the buy we go to next
            if (buys[index].amount) index++;
            // We just consumed the sell by uses his maximum amount
            amount = 0;
        }
        if (amount < (1 / (10 ^ 12))) amount = 0;
    }

    return benefits;
}

/**
 * Get full benefits for a symbol if we simulate a sell trade
 * @param {*} symbol the symbol to analyze
 * @param {*} price the sell price
 * @param {*} amount the simulated amount to sell
 * @returns 
 */
exports.simulateBenefits = async (symbol, price, amount) => {
    const benefits = await this.getBenefits(symbol);
    const simulatedBenefits = await this.simulateSell(symbol, price, amount);
    return benefits + simulatedBenefits;
}

/**
 * Get full benefits for a symbol if we simulate a sull sell trade
 * @param {*} symbol the symbol to analyze
 * @param {*} price the sell price
 * @returns 
 */
exports.simulateAllBenefits = async (symbol, price) => {
    const amount = await this.getActualAmount(symbol);
    return await this.simulateBenefits(symbol, price, amount);
}