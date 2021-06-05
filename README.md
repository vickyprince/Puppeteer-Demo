# puppeteerDemo

This project is created using puppeteer and typescript

Inorder to run this project follow these steps
1. Do run these commands for package installation-> "npm init" and "npm install puppeteer".
2. Run this command to launch the application -> "node index.js"

Two ways to run this project

1. By opening chromium and see all the user events happening which can be done by making very small change in the index.ts
    In index.ts, go to line number 17 and headless to false to open the browser while running the server
    const browser = await puppeteer.launch({ headless: false });

2. Runing the server without opening the browser. By default i have made it work without opening the browser.

PS:Both will give the same output. I have already ran the scripts and stored the list of airport data inside airportList.json which is in the project folder.

Running the project> node index.js

Thank you
Vicky Prince Victor
