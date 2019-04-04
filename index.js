let puppeteer = require('puppeteer');

let {
    accounts,
    github
} = require('./config');



const capture = async (browser, address, filename) => {
    const page = await browser.newPage();
    await page.goto(address);


    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio
        };
    });

    await page.screenshot({
        path: filename,
        fullPage: true
    });
}



(async () => {
    const browser = await puppeteer.launch();
    let corps = Object.keys(accounts);

    for (let j = 0; j < corps.length; j++) {
        let corp = corps[j];
        let corpAccounts = accounts[corp];

        let promises = corpAccounts.map(async account => {
            let address = github.replace('{{account}}', account);
            return await capture(browser, address, './png/' + account + '.png');
        });

        for (let i = 0; i < promises.length; i++) {
            console.log('resolved', corp + ' 第' + (i + 1) + '张')
            await promises[i];
        }
    }

    await browser.close();

})();