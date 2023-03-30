// import required packages
const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static(__dirname));

app.use(bodyparser.urlencoded({ extended: true }));

// On the home route, send signup html template
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/", function (req, res) {
  const email = req.body.Email;
  const firstName = req.body.firstName;
  const lastName = req.body.secondName;

  const data = {
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
  const url = "https://us17.api.mailchimp.com/3.0/lists/b28c4b2258";
  const options = {
    method: "POST",
    auth: "b28c4b2258:d6ee32065938ba6ef999c5dd52ad6697-us17",
  };

  // On success send users to success, otherwise on failure template
  const request = https.request(url, options, function (response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      
    });
  });
  request.write(jsonData);
  request.end();
});

// Failure route
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000.");
});

// Mailchimp api key = d6ee32065938ba6ef999c5dd52ad6697-us17
// Audience or list id = b28c4b2258
