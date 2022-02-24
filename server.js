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

app.use(passport.authenticate(APIStrategy.STRATEGY_NAME, {
    session: false
}));

// Sample API
app.post('/api', (req, res) => {
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
        json: req.body, 
        headers: {'Authorization': req.header('Authorization')} },
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