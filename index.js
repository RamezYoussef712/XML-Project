const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require("fs");
const xml2js = require("xml2js");
const formatXml = require("xml-formatter");


app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.get('/', (req, res) => {
    const xml = fs.readFileSync("./data.xml");
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
        if (err) {
            throw err;
        }
        // `result` is a JavaScript object
        // convert it to a JSON string
        // const jsonXml = JSON.stringify(result, null, 4);

        res.sendFile(__dirname + '/index.html');
    })
});

app.get('/delete', (req, res) => {
    const xml = fs.readFileSync("./data.xml");
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
        if (err) {
            throw err;
        }
        let searchedName = req.query.name;
        let serverRes = { 'response': 'error' };
        for (let i = 0; i < result.employee.contact.length; i++) {
            if (result.employee.contact[i].name[0] === searchedName) {
                result.employee.contact.splice(i, 1);
                serverRes = { 'response': 'success' }
                var builder = new xml2js.Builder();
                var finalXml = builder.buildObject(result);
                fs.writeFile("./data.xml", formatXml(finalXml, { collapseContent: true }), function (err, result) {
                    if (err) {
                        console.log("err")
                    } else {
                        console.log("Xml file successfully updated.")
                    }
                });
                break;
            }
        }
        res.send(serverRes);
    })
});

app.get('/search', (req, res) => {
    const xml = fs.readFileSync("./data.xml");
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
        if (err) {
            throw err;
        }
        // console.log(result);
        let searchedName = req.query.name;
        let searchData = {
            'name': '',
            'phone': '',
            'address': '',
            'email': ''
        };

        for (let contact of result.employee.contact) {
            if (contact.name[0] === searchedName) {
                searchData = {
                    ...contact
                };
                break;
            }
        }
        // if (searchData.name === '') {
        //     searchData = { 'error': 'Employee not Found!' };
        // }

        res.send(searchData);
    })
})

app.post('/update', (req, res) => {
    const xml = fs.readFileSync("./data.xml");
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
        if (err) {
            throw err;
        }

        let postData = req.body;
        let serverRes = { 'response': 'error' };
        for (let i = 0; i < result.employee.contact.length; i++) {
            if (result.employee.contact[i].name[0] === postData.name) {
                result.employee.contact[i].name[0] = postData.name;
                result.employee.contact[i].phone[0] = postData.phone;
                result.employee.contact[i].address[0] = postData.address;
                result.employee.contact[i].email[0] = postData.email;
                serverRes = { 'response': 'success' };
                console.log(serverRes);
                var builder = new xml2js.Builder();
                var finalXml = builder.buildObject(result);
                fs.writeFile("./data.xml", formatXml(finalXml, { collapseContent: true }), function (err, result) {
                    if (err) {
                        console.log("err")
                    } else {
                        console.log("Xml file successfully updated.")
                    }
                });
                break;
            }
        }
        res.send(serverRes);
    })
})


app.post('/', urlencodedParser, (req, res) => {
    let xml = fs.readFileSync("./data.xml");
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
        if (err) {
            throw err;
        }

        let postData = req.body;
        let x = {};
        for (let key in result) {
                if (result.employee.contact) {
                    postData.id = parseInt((result.employee.contact[result.employee.contact.length - 1]).id, 10) + 1;
                    result.employee.contact.push(postData);
                } else {
                    result.employee = { contact: [] };
                    postData.id = 1;
                    result.employee.contact.push(postData);
                }
        }

        var builder = new xml2js.Builder();
        var finalXml = builder.buildObject(result);
        fs.writeFile("./data.xml", formatXml(finalXml, { collapseContent: true }), function (err, result) {
            if (err) {
                console.log("err")
            } else {
                console.log("Xml file successfully updated.")
            }
        });
        res.redirect('/?success=true');
    })
});


app.listen(3000);