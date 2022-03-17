const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const EURCONVERTION = 1.1270;

importTrades = async () => {
    const fileStream = fs.createReadStream('/Users/FlorianCHIRAUX/Downloads/order-history.csv');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let header = true;

    for await (const line of rl) {
        if (!header) {
            const trade = {
                amount: +(+line.split(',')[7]).toFixed(12),
                price: +(+line.split(',')[9]).toFixed(2),
                sell: line.split(',')[4] === 'sell',
                symbol: line.split(',')[3],
                timestamp: line.split(',')[2]
            }

            if (trade.symbol.toUpperCase().includes('eur'.toUpperCase())) {
                trade.price *= EURCONVERTION;
                trade.symbol.replace('EUR', 'USD')
            }

            axios.put('http://localhost:9090/api/trade', trade).catch(err => { console.log(err) });
        }
    }
}

await importTrades();