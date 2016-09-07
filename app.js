var express = require('express');
var app = express();
var path = require('path');

app.set('port', 7001);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, './statics')));

app.get('/', (req, res) => {
	res.render('./index');
})

app.listen(app.get('port'), function () {
    console.log("Listen on port: "+app.get('port'));
});