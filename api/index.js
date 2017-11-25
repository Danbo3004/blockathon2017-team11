var express = require('express');
var app = express();
var Web3 = require('web3');
var sandboxUrl = 'http://localhost:8545';
var web3 = new Web3(new Web3.providers.HttpProvider(sandboxUrl));
var contractAddress = '0xf5e93c61e894fe8f980cd07b8d10977a3e80281a902894e551beeef5a56c106c';
var contractAbi = require('./Voting.json');
console.log(contractAbi);

var myContract = new web3.eth.Contract(contractAbi,
    '0xf5e93c61e894fe8f980cd07b8d10977a3e80281a902894e551beeef5a56c106c', {
    from: '0xf5e93c61e894fe8f980cd07b8d10977a3e80281a902894e551beeef5a56c106c',
    gasPrice: '66000'
});

web3.eth.defaultAccount = web3.eth.accounts[0];
let contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

app.get('/totalVoteEvent/:eventId', function (req, res) {
  var eventId = req.param.eventId;
  res.send(contractInstance.totalVoteForEvent(eventId));
})

app.get('/voteInfo/:address/:eventId', function (req, res) {
   var address = req.param.address;
   var eventId = req.param.eventId;
  res.send(contractInstance.voteInfo(address, eventId));
})

app.get('/setGreeting', function (req, res) {
    contractInstance.setGreeting('Hello BIOTS2016!');
    res.send('set greeting!');
})


app.get('/totalVotesFor/:candidateId/:eventId', function (req, res) {
   var candidateId = req.param.candidateId;
   var eventId = req.param.eventId;
    res.send(contractInstance.totalVotesFor(eventId, candidateId));
})

app.post('/voteForCandidate/:eventId', function (req, res) {
   var cadidates = req.body.candidates;
   var eventId = req.param.eventId;
    res.send(contractInstance.voteForCandidate(eventId, cadidates));
})

var server = app.listen(8080, function () {
  console.log("express server running");
  console.log('default account: ' + web3.eth.accounts[0])
})
