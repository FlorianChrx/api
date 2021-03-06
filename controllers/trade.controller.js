const {Trade} = require('../model/trade.model')
const {Sequelize} = require("sequelize");
const {DefaultController} = require("./default.controller");

const PRECISION = 12;
const PRICE_PRECISION = 2;

module.exports = class TradeController extends DefaultController {

    constructor() {
        super(Trade);
    }


    /**
     * Browse trades to arrive at now and potentially execute functions
     * action[0] is the action executed when sell amount is bigger than the buy one
     * action[1] is the action executes when sell amount is lower than the buy one
     * @param {*} buys the list of buy trades
     * @param {*} sells the list of buy trades
     * @param {*} index the index to use for browse trades
     * @param {*} actions an array of 2 actions to execute (need parameters: sell (current sell), buys (the buys list), index (current index position))
     * @returns the index in buys trades after browsing
     */
    browse(buys, sells, index, actions) {
        sells.forEach(sell => {
            while (sell.amount > 0) {
                if (sell.amount > buys[index].amount) {
                    // If sell amount is bigger than buy one we use the buy amount for the calcul and reduce sell amount
                    if (actions[0]) actions[0](sell, buys, index);
                    // We reduce the sell amount for next loop
                    sell.amount -= buys[index].amount;
                    // We go to nex buy because we consumed this one by uses his maximum amount
                    index++;
                } else {
                    // If buy amount is bigger than sell one we use the sell amount for the calcul and reduce buy amount
                    if (actions[1]) actions[1](sell, buys, index);
                    // We reduce buy amount for next sells calcul
                    buys[index].amount -= sell.amount;
                    // If we consumed the buy we go to next
                    if (buys[index].amount < 10 ** -PRECISION) index++;
                    // We just consumed the sell by uses his maximum amount
                    sell.amount = 0;
                }
                if (sell.amount < 10 ** -PRECISION) sell.amount = 0;
            }
        });
        return index;
    }

    /**
     * Get a trade by his amount, price and date
     * @param {*} amount the amount of searched trade
     * @param {*} price the price of searched trade
     * @param {*} symbol the symbol of searched trade
     * @param {*} date the date of searched trade
     */
    async existingTrade(amount, price, symbol, date) {
        if (!date) return false;

        let trades = await Trade.findAll({
            where: {
                amount: amount, price: price, symbol: symbol, timestamp: date
            }
        })

        return trades && trades.length === 1;
    }

    /**
     * Create a trade with a coherence verification
     * @param {*} trade the trade we are attempting to create
     * @returns a boolean to alert a loose or the created trade
     */
    async create(trade) {
        if (trade.amount === 0) return false;
        if (trade.amount > await this.getActualAmount(trade.symbol)) return false;
        if ((await this.existingTrade(trade.amount, trade.price, trade.symbol, trade.timestamp))) return false;
        trade.symbol = trade.symbol.replace('/', '-');
        if (trade.symbol.includes('EUR')) return false;
        return super.create(trade);
    }

    /**
     * Get buy trades filtered by symbol
     * @param {string} symbol the symbol of trade
     * @returns Promise the queried trade list
     */
    async getBuyTrades(symbol) {
        return this.getTradesByType(symbol, false);
    }

    /**
     * Get sell trades filtered by symbol
     * @param {string} symbol the symbol of trade
     * @returns Promise the queried trade list
     */
    async getSellTrades(symbol) {
        return this.getTradesByType(symbol, true);
    }

    /**
     * Calcul benefits realized by all trades
     * @param {*} symbol the symbol to analyze
     * @returns Promise the benefits (loses if negative)
     */
    async getBenefits(symbol) {

        const buys = await this.getBuyTrades(symbol);
        const sells = await this.getSellTrades(symbol);
        let benefits = 0;

        this.browse(buys, sells, 0, [(sell, buys, index) => {
            benefits += buys[index].amount * sell.price - buys[index].amount * buys[index].price;
        }, (sell, buys, index) => {
            benefits += sell.amount * sell.price - sell.amount * buys[index].price;
        },])

        return +benefits.toFixed(PRICE_PRECISION);
    }

    /**
     * Calcul benefits for all symbols
     * @returns Promise the benefices (loses if negative)
     */
    async getAllBenefits() {
        let symbols = await this.getSymbols();

        let benefits = 0;

        let temp;
        for (let symbol of symbols) {
            temp = await this.getBenefits(symbol);
            benefits += temp;
        }

        return +benefits.toFixed(PRICE_PRECISION);
    }

    /**
     * Get all the symbols
     * @returns Promise the symbols
     */
    async getSymbols() {
        return (await Trade.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('symbol')), 'symbol'],]
        })).map(symbol => symbol.symbol);
    }

    /**
     * Calcul average price for a symbol
     * @param {*} symbol the symbol to analyze
     * @returns Promise the average price for this symbol
     */
    async getAveragePrice(symbol) {
        const buys = await this.getBuyTrades(symbol);
        const sells = await this.getSellTrades(symbol);
        let index = 0;

        index = this.browse(buys, sells, index, [null, null])

        let totalAmount = 0;
        let totalPrice = 0;

        for (; index < buys.length; index++) {
            totalAmount += buys[index].amount;
            totalPrice += buys[index].amount * buys[index].price
        }

        return +(totalPrice / totalAmount).toFixed(PRICE_PRECISION);
    }

    /**
     * Get trades filtered by symbol and type
     * isSell false = buy trade
     * isSell true = sell trade
     * @param {string} symbol the symbol of trade
     * @param {boolean} isSell the sell marker
     * @returns Promise the queried trade list
     */
    async getTradesByType(symbol, isSell) {
        return await Trade.findAll({
            where: {
                symbol: symbol, sell: isSell
            }, order: [['timestamp', 'ASC'],]
        })
    }

    /**
     * Get the actual amount for a symbol
     * @param {*} symbol the symbol to analyze
     * @returns Promise the actual amount for the symbol
     */
    async getActualAmount(symbol) {
        const buys = await this.getBuyTrades(symbol);
        const sells = await this.getSellTrades(symbol);
        let index = 0;

        index = this.browse(buys, sells, index, [null, null])

        let actualAmount = 0;

        for (; index < buys.length; index++) {
            actualAmount += buys[index].amount;
        }

        return +actualAmount.toFixed(PRECISION);
    }

    /**
     * Get the actual money invested for a symbol
     * @param {*} symbol the symbol to analyze
     * @returns Promise the actual money invested for the symbol
     */
    async getActualInvested(symbol) {
        let averagePrice = await this.getAveragePrice(symbol);
        let actualAmount = await this.getActualAmount(symbol);
        return +(averagePrice * actualAmount).toFixed(PRECISION);
    }

    /**
     * Get the actual money invested for all symbols
     * @returns Promise the full money invested
     */
    async getAllActualInvested() {
        let symbols = await this.getSymbols();

        let actualInvested = 0;

        let temp;
        for (let symbol of symbols) {
            temp = await this.getActualInvested(symbol);
            if (temp) actualInvested += temp;
        }

        return +actualInvested.toFixed(PRECISION);
    }

    /**
     * Get benefits if sell all symbol at a defined price
     * @param {*} symbol the symbol to analyze
     * @param {*} price the sell price
     * @returns Promise gains for this full sell
     */
    async simulateFullSell(symbol, price) {
        const amountToSell = await this.getActualAmount(symbol);
        return await this.simulateSell(symbol, price, +amountToSell.toFixed(PRECISION));
    }

    /**
     * Get benefits of a potential sell is done at a defined price
     * @param {*} symbol the symbol to analyze
     * @param {*} price the sell price
     * @param {*} amount the amount sell
     * @returns Promise gains for a sell
     */
    async simulateSell(symbol, price, amount) {
        const buys = await this.getBuyTrades(symbol);
        const sells = await this.getSellTrades(symbol);

        let benefits = 0;

        const simulateSell = [{
            amount: amount, price: price, symbol: symbol, sell: false
        }]

        this.browse(buys, simulateSell, this.browse(buys, sells, 0, [null, null]), [(sell, buys, index) => {
            benefits += buys[index].amount * sell.price - buys[index].amount * buys[index].price;
        }, (sell, buys, index) => {
            benefits += sell.amount * sell.price - sell.amount * buys[index].price;
        },])

        return +benefits.toFixed(PRECISION);
    }

    /**
     * Get full benefits for a symbol if we simulate a sell trade
     * @param {*} symbol the symbol to analyze
     * @param {*} price the sell price
     * @param {*} amount the simulated amount to sell
     * @returns Promise benefits after a sell simulation
     */
    async simulateBenefits(symbol, price, amount) {
        const benefits = await this.getBenefits(symbol);
        const simulatedBenefits = await this.simulateSell(symbol, price, amount);
        return +(benefits + simulatedBenefits).toFixed(PRICE_PRECISION);
    }

    /**
     * Get full benefits for a symbol if we simulate a sell trade
     * @param {*} symbol the symbol to analyze
     * @param {*} price the sell price
     * @returns Promise benefits after a full sell simulation
     */
    async simulateAllBenefits(symbol, price) {
        const amount = await this.getActualAmount(symbol);
        return await this.simulateBenefits(symbol, price, amount);
    }

    /**
     * Get benefits of a potential sell is done at a defined price
     * @param {*} symbol the symbol to analyze
     * @param {*} price the sell price
     * @param {*} percentage the percentage of amount to sell
     * @returns Promise gains after a partial sell simulation
     */
    async simulatePartialSell(symbol, price, percentage) {
        let amount = await this.getActualAmount(symbol);
        return await this.simulateSell(symbol, price, amount * percentage / 100);
    }

    /**
     * Determine the full benefits for a symbol after a partial sell simulation
     * @param {*} symbol the symbol to analyze
     * @param {*} price the simulated sell price
     * @param {*} percentage the percentage of amount sell
     * @returns Promise benefits after a partial sell simulation
     */
    async simulatePartialBenefits(symbol, price, percentage) {
        let amount = await this.getActualAmount(symbol);
        return await this.simulateBenefits(symbol, price, amount * percentage / 100);
    }

    /**
     * Get all actual amounts for all symbols
     * @returns Promise an array of an array of amounts
     */
    async getAllActualAmount() {
        let symbols = await this.getSymbols();

        let array = [];

        let amount;
        for (let symbol of symbols) {
            amount = await this.getActualAmount(symbol);
            array.push({
                symbol: symbol, amount: amount
            })
        }

        return array;
    }

    /**
     * Refresh the amount for a symbol by execute a trade with a price of 0
     * (A chain fee or a free obtain token is a sell or buy at 0)
     * @param {*} symbol the symbol to treat
     * @param {*} amount the real amount
     */
    async refreshAmount(symbol, amount) {
        let theoreticAmount = await this.getActualAmount(symbol);
        if (theoreticAmount < amount) {
            let correction = amount - theoreticAmount;
            if (correction < 10 ** -PRECISION) return;
            await super.create(Trade, {
                amount: correction.toFixed(PRECISION), price: 0, sell: false, symbol: symbol, timestamp: Date.now()
            })
        } else if (theoreticAmount > amount) {
            let correction = theoreticAmount - amount;
            if (correction < 10 ** -PRECISION) return;
            await super.create(Trade, {
                amount: correction.toFixed(PRECISION), price: 0, sell: true, symbol: symbol, timestamp: Date.now()
            })
        }
    }
}