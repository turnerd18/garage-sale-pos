# Garage Sale POS

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<!-- ![alt text](https://github.com/turnerd18/garage-sale-pos/blob/main/screenshot.jpg?raw=true) -->
<img src="https://github.com/turnerd18/garage-sale-pos/blob/main/screenshot.jpg?raw=true" width="500" style="max-width:60%"/>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Cloud Functions Linting

To re-enable, add this back to the `firebase.json`

```
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint"
    ]
  }
```