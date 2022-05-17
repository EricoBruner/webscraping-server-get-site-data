import { Router } from 'express';

import { getBrowserInstance } from './utils/getBrowserInstance';
import { formattedText } from './utils/formattedText';

export const routes = Router();

routes.post('/', async(req, res) => {

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

    const titleOne = await page.title()

    const titleTwo = await page.evaluate(() => {
      return ([...document.querySelectorAll('h2')]
      .map((list) => {
        const arrayList = list.innerText.split('\n')
        for( var i=0; i < arrayList.length; i++ ) {
          if(arrayList[i].match(/Dados/)) {
            return arrayList
          }
        }
      })
      .find(list => list != null))
    })

    const textPageOne = formattedText(await page.evaluate(() => 
      document.querySelector('div.thecontent > p:nth-child(1)')
      ?.textContent)
    );
    const textPageTwo = formattedText(await page.evaluate(() => 
      document.querySelector('div.thecontent > p:nth-child(3)')
      ?.textContent)
    );
    
    const textPageThree = formattedText(await page.evaluate(() => 
      document.querySelector('div.thecontent > p:nth-child(5)')
      ?.textContent)
    );

    const textPageFour = await page.evaluate(() => {
      return ([...document.querySelectorAll('p')]
      .map((list) => {
        const arrayList = list.innerText.split('\n')
        for( var i=0; i < arrayList.length; i++ ) {
          if(arrayList[i].match(/Confira abaixo todos os dados do/)) {
            return arrayList
          }
        }
      })
      .find(list => list != null))
    })

    const listPageOne = await page.evaluate(() => {
      return ([...document.querySelectorAll('ul')]
      .map((list) => {
        const arrayList = list.innerText.split('\n')
        for( var i=0; i < arrayList.length; i++ ) {
          if(arrayList[i] === 'Permutas' || arrayList[i] === 'Penhoras' || arrayList[i] === 'Usufruto' || arrayList[i] === 'Contratos') {
            return arrayList
          }
        }
      })
      .find(list => list != null))
    })

    const listPageTwo = await page.evaluate(() => {
      return ([...document.querySelectorAll('ul')]
      .map((list) => {
        var arrayList = list.innerText.split('\n ')
        for( var i=0; i < arrayList.length; i++ ) {
          arrayList[i] = arrayList[i].trim()
          if(arrayList[i] === 'Situação do cartório: Ativo' || arrayList[i] === 'Situação do cartório: Inativo') {
            return arrayList
          }
        }
      })
      .find(list => list != null))
    })

    const listPageOneFormatted =  listPageOne.map((string:string) => {
      return '<li>' + string + '</li>'
    }).join('')

    const listPageTwoFormatted = listPageTwo.map((string:string) => {
      return '<li>' + string + '</li>'
    }).join('')

    res.json({
      titleOne,
      titleTwo,
      textPageOne,
      textPageTwo,
      textPageThree,
      textPageFour,
      listPageOne,
      listPageTwo,
      listPageOneFormatted,
      listPageTwoFormatted,
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