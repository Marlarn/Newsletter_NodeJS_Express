const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.post("/", (req, res) => {
    const { fName, lName, email } = req.body
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data)

    const url = `https://us21.api.mailchimp.com/3.0/lists/99443e23ed`
    
    const options = {
        method: "POST",
        auth: "mariLofthus:2f149d96184894685d63735aae6a3a65-us21",
    }

    const request = https.request(url, options, response => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", data => {
            console.log(JSON.parse(data))
        })//.on("error", error => )
    })
    request.write(jsonData)
    request.end()
})

// Set process.env.PORT instead of 3000 for server hosting, dynamic on the go port
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000")
})

// 2f149d96184894685d63735aae6a3a65-us21
// audience ID 99443e23ed