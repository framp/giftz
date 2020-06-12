# Giftz

An OSS application to manage encrypted giftcards.

WIP but functional if you like to fiddle.

## How to use

 - Visit https://giftz.framp.me/#generateKey, this will generate a key and store it in your LocalStorage
 - Add your cards data in the top textbox following the format (barcode is a base64 encoded png):
```js
[{
  "barcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATgAAABkAQMAAAAoir4RAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAEpJREFUSIntyrEJADEIQNGAreAqwrVCVhccwFUObA+SKa77r35rrPw1kRDNnKoO8/BWmdKzY2ueJ79ePB6Px+PxeDwej8fj8X57Fyyp9/PFewItAAAAAElFTkSuQmCC",
  "number": "6341753502310869272",
  "pin": "1234",
  "amount": "20£",
  "id": "1"
}]
```
 - Get the `#importKey` link from the bottom input, send it safely to your target device 
 - Get the `addCard` links from the bottom textbox, store them safely and send them to your device of choice without worrying about safety (a man in the middle will need to have the key from the previous step or access to your device to decrypt them)
 - Click on the `I'm done` button to load the cards in your LocalStorage and access the application

## Tech

This project was bootstrapped with [Create Solid](https://github.com/ryansolid/create-solid).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
