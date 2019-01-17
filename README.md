# AppSheet React App Youngest Users

A simple React app built using Facebook's [react-create-app](https://github.com/facebook/create-react-app) and Google's [material-ui](https://material-ui.com/). It displays the bios of the 5 youngest users from a provided test API.

## Extra Credit: How to Test

To test this app, I would seperate into front and backend tests. 

### Frontend Testing
Jasmine tests similar to what is done in `App.test.js` could be written for all components as unit tests. Integration tests could be written using browser automation like Selenium or Puppeteer.

### Backend Testing
Backend unit tests could cover the endpoints using a language-specific testing suite (for example `unittest` in Python). In addition, REST testing using `frisby.js` for the API endpoints.

## API

**Service Endpoint**

https://appsheettest1.azurewebsites.net/sample/

 

**method**

list

 

**notes**

This method will return an array of up to 10 user id's.  If there are more than 10 results the response will also contain a token that can be used to retrieve the next set of results.  This optional token can be passed as a query string parameter

ex https://appsheettest1.azurewebsites.net/sample/list or https://appsheettest1.azurewebsites.net/sample/list?token=b32b3

 

**method**

detail/{user id}

 

**notes**

This method will returns the full details for a given user 

ex http://appsheettest1.azurewebsites.net/sample/detail/21