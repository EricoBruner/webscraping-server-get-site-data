import { Router } from 'express';

import { getBrowserInstance } from './utils/getBrowserInstance';
import { formattedText } from './utils/formattedText';

export const routes = Router();

routes.get('/', async(req, res) => {

  const { URL } = req.body;

  if (!URL) {
		res.json({
			status: 'error',
			error: 'Entre com uma URL valida'
		});
		return;    
	}

  let browser = null;
  try {
		browser = await getBrowserInstance()
		let page = await browser.newPage()
		await page.goto(URL)
    const title = await page.title()

    const textPageOne = formattedText(await page.evaluate(() => 
      document.querySelector('div > div > div > div.thecontent > p:nth-child(1)')
      ?.textContent)
    );
    const textPageTwo = formattedText(await page.evaluate(() => 
      document.querySelector('div > div > div > div.thecontent > p:nth-child(3)')
      ?.textContent)
    );
    //
    const textPageThree = formattedText(await page.evaluate(() => 
      document.querySelector('div > div > div > div.thecontent > p:nth-child(5)')
      ?.textContent)
    );

    // const textPageFour = await page.evaluate(() => 
    //   document.querySelectorAll('ul').item(0).innerText)
    
    const textPageFour = await page.evaluate(() => {
      return ([...document.querySelectorAll('ul')][0].innerText.split('\n'))
    })
    

    res.json({
      title,
      textPageOne,
      textPageTwo,
      textPageThree,
      textPageFour,
    })
  } catch (error) {
      console.log(error)
      res.json({
        status: 'error',
        data: error || 'Something went wrong'
      })
      // return callback(error);
    } finally {
      if (browser !== null) {
        await browser.close()
      }
    }
})