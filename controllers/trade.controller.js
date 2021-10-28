const { Trade } = require("../model/trade.model")

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
exports.getAllBenefits = async (symbol) => {
    throw new Error("Not yet implemented !");
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