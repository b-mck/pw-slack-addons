var express = require('express');
var https = require('https');
var url = require('url');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});

var url = require('url');

app.get('/slash', function(request, response) {
	console.log('Request: ' + JSON.stringify(request.query));
	switch (request.query.command) {
		case '/flip':
			var fliptext = '@' + request.query.user_name + '\'s current status: ' + rageflip(request.query.text);
			postAsSlackbot(fliptext, request.query.channel_name);
			break;
		default:
			break;
	}
});

function postAsSlackbot(message, channel) {
	var pwHostname = process.env.PW_SLACK_HOSTNAME;
	var pwToken = process.env.PW_SLACK_TOKEN;
	var options = {
		hostname: pwHostname,
		path: '/services/hooks/slackbot?token=' + pwToken
			+ '&channel=%23' + encodeURIComponent(channel),
		method: 'POST'
	}
	
	var req = https.request(options, function(res) {
		res.on('data', function (data) {
			process.stdout.write(data);
		});
	});
	req.write(message);
	req.end();
}

// rageflip implementation thanks to @lourobouros and github.com/robotlolita
function rageflip(text) {
	return '(╯°□°）╯︵ ' + flip(text);
}

function flip(text) {
	var chars = " -_abcdefghijklmnopqrstuvwxyz1234567890";
	var flipped = " -_ɐqɔpǝɟɓɥıɾʞlɯuodbɹsʇnʌʍxʎz⇂zƐㄣϛ9ㄥ860";

  	return text.toLowerCase()
	.split('')
	.reverse()
	.join('')
	.replace(/./g, function(a) {
		var i = chars.indexOf(a);
		return i != -1 ? flipped[i] : '';
	})
};