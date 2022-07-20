
# Contentful JSON Viewer 
[![Install to Contentful](https://www.ctfstatic.com/button/install-small.svg)](https://app.contentful.com/deeplink?link=apps&id=4bRzX5Wgvdb1GrEs4YalQM)


This app adds a new tab on the entry aditor allowing you to visualize the JSON payload for the current entry. This object is the result of calling the `space.getEntry(entryId)` App framework method on the entry.

It leverages an open source library called [react-json-view](https://github.com/mac-s-g/react-json-view) to format the JSON object in a user-friendly manner.

![image](https://user-images.githubusercontent.com/840764/125956326-49ee7285-85aa-4d74-a223-aa09c2fc45aa.png)

## Installation

When creating the App definition within the Contentful Org, make sure to select the following app locations:
![image](https://user-images.githubusercontent.com/840764/125956578-c0775b00-3b67-4d53-bf73-dd7b17f5dd71.png)


## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

