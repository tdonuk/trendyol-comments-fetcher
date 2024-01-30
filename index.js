const puppeteer = require("puppeteer");
console.info("starting...");

const MAX_COMMENTS = 200;

async function startProcess() {
    console.info("launching browser..")
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("https://www.trendyol.com/fantom/pratik-1200-supurge-500-w-gri-p-35509789/yorumlar");

    const commentArr = [];

    const cookiesButton = await page.waitForSelector("#onetrust-accept-btn-handler");
    cookiesButton.click();

    await page.waitForNavigation();

    await new Promise(resolve => setTimeout(resolve, 2000));

    const starBoxes = await page.$$("div[class='ps-stars__content']");

    let index = starBoxes.length;
    for(let starBox of starBoxes) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        await starBox.click();

        await new Promise(resolve => setTimeout(resolve, 1000));

        let commentsContainer = await page.waitForSelector("div[class='reviews-content']");

        let comments = await commentsContainer.$$("div[class='comment-text'] p");

        while(comments.length < 200) { // fetch top 200 comments per rating
            await new Promise(resolve => setTimeout(resolve, 500));

            await page.evaluate(() => {
                window.scrollTo(0, window.document.getElementsByClassName("reviews-content")[0].scrollHeight);
            });

            comments = await commentsContainer.$$("div[class='comment-text'] p");
        }

        for(let comm of comments) {
            commentArr.push(await page.evaluate(el => el.textContent, comm));
        }

        console.info("found " + comments.length + " comments that is voted with " + index + " stars")

        await starBox.click();

        await new Promise(resolve => setTimeout(resolve, 2000));

        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        index--;
    }

    console.info("total comments: " + commentArr.length);

    await browser.close();
}

startProcess();