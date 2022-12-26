import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();

const loginAuthentication = async (page) => {
    try {
        const user_input = await page.$('input[autocomplete="username"]');
        if (user_input) {
            await user_input.type(process.env.twiteerUserName);
        }
        const buttonList = await page.$$('div[role="button"]');
        if (buttonList.length) {
            await buttonList[2].click();
        }

        const user_password = await page.waitForSelector('input[autocomplete="current-password"]');
        if (user_password) {
            await user_password.type(process.env.twiteerPassword);
        }

        const nextClickList = await page.$$('div[role = "button"]');
        if (nextClickList.length) {
            await nextClickList[2].click();
        }
    } catch (e) {
        console.log("authentication error", e)
    }
}

const writePost = async (page) => {
    try{
        await page.waitForSelector('.DraftEditor-root');
        await page.click('.DraftEditor-root');
        await page.keyboard.type("Hello test tweet");

        await page.waitForSelector('div[role="button"][data-testid]');
        const tweetButton = await page.$$('div[role="button"][data-testid]');
        if (tweetButton) {
            await tweetButton[7].click();
        }
    }catch(e){
        console.log("Error on posting tweet",e)
    }

}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const URL = 'https://twitter.com/i/flow/login/';
    try{
        await page.goto(URL, { waitUntil: "networkidle0" });
        await loginAuthentication(page);
        const tweetLink = await page.waitForSelector('a[href="/compose/tweet"]');
        if(tweetLink){
            await Promise.all([
                page.waitForNavigation({ waitUntil: "networkidle0" }),
                tweetLink.click()
            ]);
        }
        await writePost(page);
    }catch(e){
        console.log("error",e)
    }
    return;
    
    await browser.close();
})();