const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require("fs");
const xmlParser = require("xml2json");
const formatXml = require("xml-formatter");


app.use('/static', express.static(path.join(__dirname, 'static')))

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    fs.readFile("./data.xml", function (err, data) {
        const xmlObj = xmlParser.toJson(data, { reversible: true, object: true });
        // const contactsArray = xmlObj["employee"]["contact"];
        // console.log(JSON.stringify(contactsArray));
        res.sendFile(__dirname + '/index.html');
    })
});

app.post('/', urlencodedParser, (req, res) => {
    fs.readFile("./data.xml", function (err, data) {
        const xmlObj = xmlParser.toJson(data, { reversible: true, object: true });
        let { ...postData } = req.body;
        let x = {};
        for (let key in postData) {
            if (postData.hasOwnProperty(key)) {
                x[key] = { "$t": postData[key] };
            }
        }
        xmlObj.employee.contact.push(x)
        // console.log('Got body', req.body);
        console.log(xmlObj);
        const stringifiedXmlObj = JSON.stringify(xmlObj)
        const finalXml = xmlParser.toXml(stringifiedXmlObj)
        fs.writeFile("./data.xml", formatXml(finalXml, { collapseContent: true }), function (err, result) {
            if (err) {
                console.log("err")
            } else {
                console.log("Xml file successfully updated.")
            }
        })
        res.sendStatus(200);
    });

});

app.listen(3000);