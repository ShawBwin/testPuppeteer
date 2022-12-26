import e from 'express';
import puppeteer from 'puppeteer';


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const allFlightArr = [];
    const page = await browser.newPage();

    await page.goto('https://www.google.com/travel/flights/search?tfs=CBwQAhopagwIAhIIL20vMDRjeDUSCjIwMjMtMDEtMTJyDQgDEgkvbS8wMl8yODYaKWoNCAMSCS9tLzAyXzI4NhIKMjAyMy0wMS0xNnIMCAISCC9tLzA0Y3g1cAGCAQsI____________AUABSAGYAQE', { waitUntil: "networkidle0" });

    // getting all ul list
    const lists = await page.$$('ul');
    console.log("total ul ", lists.length)


    let j = 0;
    let total = 4;

    while (j < 4) {
        // starting with getting date
        const rawDate = await page.$$('div[data-value]');
        const dateRow = rawDate.find((el, i) => i === 2);
        const date = await page.evaluate(el => el.getAttribute('data-value'), dateRow)
        // console.log('date is ', date);

        // next click button
        const rawButton = await page.$$('div > button');
        const button = rawButton.find((el, i) => i === 12);

        // required li
        let targetList;
        if(lists.length === 6){
            targetList = lists.find((el, idx) => idx === 4);
        }else{
            targetList = lists.find((el, idx) => idx === 5);
        }
        let uuu = await targetList.$$('li');
        // console.log("totalll", uuu.length);

        // looping list;
        for (let i = 0; i < uuu.length; i++) {
            let element = uuu[i];

            const totalCost = await page.evaluate(el => el.querySelector('div > span[role="text"]').textContent, element);
            const startTime = await page.evaluate(el => el.querySelector('div > span > span:nth-child(1) > span > span:nth-child(1)').textContent, element);
            const endTime = await page.evaluate(el => el.querySelector('div > span > span:nth-child(2) > span > span:nth-child(1)').textContent, element);
            const duration = await page.evaluate(el => el.querySelector('div > div:nth-child(3) > div').textContent, element);
            // creating obj
            let obj = {
                id: i + 1,
                date: date,
                start: startTime.split("+")[0],
                end: endTime.split("+")[0],
                duration: duration,
                cost: totalCost
            }
            allFlightArr.push(obj);
            // console.log('the total array is',allFlightArr);
        }
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle0" }),
            button.click()
        ]);
        j += 1;
    }
    console.log("final rstttt", allFlightArr);
    
    await browser.close()
})();