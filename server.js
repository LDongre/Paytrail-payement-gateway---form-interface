const express = require('express')
const app = express();
const path = require('path')
const hbs = require('express-handlebars')
const axios = require('axios')
var crypto = require('crypto');

const PORT = 4000;

app.use(express.static('public'))

app.set('view engine', 'handlebars')
app.engine('handlebars', hbs({
  defaultLayout: 'main',
  extname: '.handlebars',
  layoutsDir: path.join(__dirname + '/views/layouts'),
  partialsDir: path.join(__dirname + '/views/partials/'),
  //helpers: require('./helpers')
}))

//routing
app.get('/', (req, res) => {

res.render('index', {
  title: 'homepage',
  content: "this is homepage",
  completed: true
  })
});

app.get('/pay', (req, res) => {

const requestData = {
  MERCHANT_ID: '13466',
  URL_SUCCESS: '139.59.87.150/demo/pizzeria-payment/success.php',
  URL_CANCEL: '139.59.87.150/demo/pizzeria-payment/error.php',
  ORDER_NUMBER: '123456',
  PARAMS_IN: 'MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT',
  PARAMS_OUT: 'PAYMENT_ID,TIMESTAMP,STATUS',
  AMOUNT: '350.00',
  AUTHCODE: ''
}
var MERCHANT_HASH = '6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ'
var mystr = MERCHANT_HASH + '|' + requestData.MERCHANT_ID + '|' + requestData.URL_SUCCESS + '|' + requestData.URL_CANCEL + '|' + requestData.ORDER_NUMBER + '|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|' + requestData.AMOUNT
//6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ|13466|139.59.87.150/demo/pizzeria-payment/success.php|139.59.87.150/demo/pizzeria-payment/error.php|123456|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|350.00
//6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ|13466|139.59.87.150/demo/pizzeria-payment/success.php|139.59.87.150/demo/pizzeria-payment/error.php|123456|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|350.0

var hash = crypto.createHash('sha256').update(mystr).digest('hex').toUpperCase()
//  console.log(hash)

requestData.AUTHCODE = hash
console.log(mystr)
//console.log(hash)
  axios({
    method: 'post',
    url: 'https://payment.paytrail.com/e2',
    params: requestData,
    responseType: 'json',
    responseEncoding: 'utf8'
  }).then((response)=>{
    console.log(response.status)
  }).then( (res) =>{
    console.log(res.data)
  }).catch( (err)=>{
    console.log(err)
  })

})

app.get('/success', (req, res) => {
res.send('success')
})

app.get('/fail', (req, res) => {
  res.send('fail')
})

app.listen(PORT, (req, res) => {
  console.log(`running at ${PORT}`)
})
