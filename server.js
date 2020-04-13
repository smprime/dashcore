const express = require('express');
const compression = require('compression');
const request = require("request");
const cors = require("cors");
const CONTEXT = `/${process.env.CONTEXT || ''}`;
const PORT = process.env.PORT || 4000;
const dirName = express.static(__dirname + '/dist/dashcore');
const app = express();
const router = express.Router();

app.use(compression());
app.use(CONTEXT, dirName);
app.use(cors());
app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/', dirName);
app.use('/bittrexapi', router);
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}${CONTEXT}`));

router.route('*').get((req, res) => {
    
    console.log('req:', req.query);
    request.get({
      "headers": { "content-type": "application/json" },
      "url": "https://api.bittrex.com/api/v1.1/"+ req.query.data
    }, 
    (error, response, body) => {
        console.log({error, response, body})
        var message = JSON.parse(body)
        res.json({message})
    })
})