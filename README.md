# Giftz

An OSS application to manage encrypted giftcards.

WIP but functional if you like to fiddle.

<img width="563" alt="Screenshot 2023-01-24 at 19 46 46" src="https://user-images.githubusercontent.com/611109/214368996-036768fc-f608-4de9-ac8e-6b2ca6788dde.png">


## How to use

 - Visit https://giftz.framp.me/keys/new
 - Generate a key
 - Add your cards data in the textarea (or drag a file onto it) following the format:
```js
[{
  "barcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATgAAABkAQMAAAAoir4RAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAEpJREFUSIntyrEJADEIQNGAreAqwrVCVhccwFUObA+SKa77r35rrPw1kRDNnKoO8/BWmdKzY2ueJ79ePB6Px+PxeDwej8fj8X57Fyyp9/PFewItAAAAAElFTkSuQmCC",
  "number": "6341753502310869272",
  "pin": "1234",
  "amount": 20,
  "currency": "£",
  "id": "1"
}]
```
 - Barcode can be:
   - A base64 encoded image
   - A value to be rendered with CODE128
   - An object `{ value, ...options }` to configure [JsBarcode](https://github.com/lindell/JsBarcode)
 - Get the `/keys/#....` link from the bottom input, send it safely to your target device 
 - Get the `/cards/#....` links from the bottom textbox, store them safely and send them to your device of choice without worrying about safety (a man in the middle will need to have the key from the previous step or access to your device to decrypt them)

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
