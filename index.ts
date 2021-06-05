const puppeteer = require('puppeteer');
const fs = require('fs');


// validate function which take string and replace the number with "dapi" if present and append "_set" to the string
const validate = (str) => {
    // console.log("str",str)
    let containsNumber=/\d/.test(str)
    if (containsNumber){
        str = str.replace(/\d/g, "dapi");
        str = str.concat("_set")
    }
    return str;
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // entry point to wikipedia by using the link provided in the document
    await page.goto('https://en.wikipedia.org/wiki/Lists_of_airports');
    // initializing the start and end point for navigation from A-Z  with its ASCII value
    var A = 65, Z = 91;
    const airportListFinal = [];
    const airportList = [];

    for (let i = A; i < Z; i++) {
        // converting ASCII value to string
        let alpha = String.fromCharCode(i);
        // creating variable for click using the classname and href link got it from the developer tools
        let hrefLink = `a[href='/wiki/List_of_airports_by_IATA_airport_code:_${alpha}']`

        try {
            // clicking the alphabets 
            await page.click(hrefLink);
            const result = await page.evaluate(() => {
                // reading the table data using the classname got it from the developer tools
                const rows = document.querySelectorAll('.wikitable tr');
                return Array.from(rows, row => {
                    const columns = row.querySelectorAll('td');
                    return Array.from(columns, column => column.innerText);
                });
            });
            // storing the data took from the table in an array
            airportList.push(result);
        }
        catch {
            // catching block if any exceptions occurs
            console.log("hrefLink", hrefLink)
        }
    }
    // iterating through each items in the array and creating the object
    for (let j = 0; j <= airportList.length; j++) {
        if (airportList[j] != undefined) {
            for (let k = 0; k <= airportList[j].length; k++) {
                if (airportList[j][k] != [] && airportList[j][k] != undefined) {
                    let tempObj = {
                        "iata": airportList[j][k][1] ? validate(airportList[j][k][0]) : '',
                        "icao": airportList[j][k][2] ? validate(airportList[j][k][1]) : '',
                        // checking whether data is null or notDeepEqual, if not then replacing the whitespaces and comma with underscore
                        "aiport name": airportList[j][k][3] ? validate(airportList[j][k][2].toLowerCase().replace(/[\s,]/g, "_")) : '',
                        "location served": airportList[j][k][4] ? validate(airportList[j][k][3].toLowerCase().replace(/[\s,]/g, "_")) : ''
                    }
                    // storing the object containg the data into an array in a required format
                    airportListFinal.push(tempObj);
                }
            }
        }
    }
    // storing all the data into a json file by using fs
    fs.writeFile('airportList.json', JSON.stringify(airportListFinal), (err) => {
            if (err)
                throw err;
            console.log('complete');
        });
    console.log("airportList", airportListFinal);
    await browser.close();
})();
