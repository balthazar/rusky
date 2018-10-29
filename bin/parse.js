const fs = require('fs')
const puppeteer = require('puppeteer')

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://masterrussian.com/vocabulary/znat.htm')

  const res = await page.evaluate(() => {
    const script = document.getElementById('wod_vocab').children[3].innerText
    return script.match(/.*soundFile: "(.*)",.*/)[1]
  })

  console.log(res)

  await browser.close()
}

main()
