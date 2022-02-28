const express = require('express');
const passport = require('passport');
const APIStrategy = require('ibmcloud-appid').APIStrategy;
const request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express();

app.use(passport.initialize());
passport.use(new APIStrategy({
    oauthServerUrl: "https://eu-de.appid.cloud.ibm.com/oauth/v4/6c32cfb3-f970-41dd-a06f-1f8b6267b7c2",
}));

app.use(express.json())

app.use(passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false
}));

app.post('/api/incidents', (req, res) => {
    console.log("Receiving request - ", req.header('Authorization'));
    console.log("Body - ", req.body);
    
    var targetURL = req.header('Target-URL');
    console.log("targetURL : ",targetURL);
    if (!targetURL) {
        res.send(500, { error: 'There is no Target-Endpoint header in the request' });
        return;
    }
    request({ 
        url: targetURL, 
        method: req.method, 
        json: req.body, 
        headers: req.header },
        function (error, response, body) {
            if (error) {
                console.error('error: ' + error)
            }
    }).pipe(res);
});

app.get('/api/description', (req, res) => {
    console.log("Receiving request - ", req.header('Authorization'));
    
    var targetURL = req.header('Target-URL');
    console.log("targetURL : ",targetURL);
    if (!targetURL) {
        res.send(500, { error: 'There is no Target-Endpoint header in the request' });
        return;
    }
    request({ 
        url: targetURL, 
        method: req.method, 
        headers: { "Authorization": "Basic ZWxhc3RpY3NlYXJjaC1hZG1pbjpNNGFiYXJIMGlJZThvYjdMSVBBamNXeHU=", "accept": "application/json", "Content-Type": "application/json" }},
        function (error, response, body) {
            if (error) {
                console.error('error: ' + error)
            }
    }).pipe(res);
});


//Start server
app.listen(3333, () => {
    console.log('listening on http://localhost:3333');
})