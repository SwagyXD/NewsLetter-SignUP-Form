const express = require("express"); // Importing the Express package
const https = require("https"); // Importing the HTTPS package
const bodyparser = require("body-parser"); // Importing the body-parser package
const mailchimp = require("@mailchimp/mailchimp_marketing"); // Importing the Mailchimp API package
const app = express(); // Creating a new Express application
app.use(express.static(__dirname)); // Serving static files in the current directory
app.use(bodyparser.urlencoded({ extended: true })); // Configuring body-parser to parse URL-encoded data

// On the home route, send signup html template
app.get("/", function (req, res) {
  // Defining a route handler for GET requests to the home route
  res.sendFile(__dirname + "/signup.html"); // Sending the signup HTML template to the client
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/", function (req, res) {
  // Defining a route handler for POST requests to the home route
  const email = req.body.Email; // Extracting the email address from the request body
  const firstName = req.body.firstName; // Extracting the first name from the request body
  const lastName = req.body.secondName; // Extracting the last name from the request body
  const data = {
    // Creating an object with the email address, status, and merge fields
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  // Converting string data to JSON data
  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/b28c4b2258"; // URL of the Mailchimp list
  const options = {
    // Configuring the HTTPS request
    method: "POST",
    auth: "b28c4b2258:d6ee32065938ba6ef999c5dd52ad6697-us17",
  };
  // On success send users to success, otherwise on failure template
  const request = https.request(url, options, function (response) {
    // Sending the HTTPS request to the Mailchimp API
    if (response.statusCode === 200) {
      // If the request is successful, send the success HTML template
      res.sendFile(__dirname + "/success.html");
    } else {
      // Otherwise, send the failure HTML template
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      // Log the response data to the console
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData); // Sending the JSON data in the HTTPS request body
  request.end(); // Ending the HTTPS request
});

// Failure route
app.post("/failure", function (req, res) {
  // Defining a route handler for POST requests to the failure route
  res.redirect("/"); // Redirecting the user back to the home route
});

app.listen(3000, function () {
  // Starting the server on port 3000
  console.log("server is running on port 3000.");
});
