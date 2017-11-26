var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var sandboxUrl = 'http://localhost:8545';
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(sandboxUrl));
var contractAddress = '0x2ad61c0ca79649f43220ba09c9c9d61d7e4dfc4d';
 require('./Voting.js');
 web3.eth.defaultAccount = web3.eth.accounts[0];
let MyContract = web3.eth.contract(contractAbi);
let contractInstance = MyContract.at(contractAddress);
console.log(contractInstance);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/totalVoteEvent/:eventId', function (req, res) {
  var eventId = req.params.eventId;
  res.send(contractInstance.totalVoteForEvent(eventId));
})

app.get('/voteInfo/:address/:eventId', function (req, res) {
   var address = req.params.address;
   var eventId = req.params.eventId;
  res.send(contractInstance.voteInfo(address, eventId));
})

app.get('/totalVotesFor/:candidateId/:eventId', function (req, res) {
   var candidateId = req.params.candidateId;
   var eventId = req.params.eventId;
    res.send(contractInstance.totalVotesFor(eventId, candidateId));
})

app.post('/voteForCandidate/:eventId', function (req, res) {
  var eventId = req.params.eventId;
  var cadidates = req.body.candidates;
  var opts = {gas: 4600000, from: '0x5e103c3af14bd1a7b4ba16a905a8c4ef8e3cc3b4'};
  console.log(cadidates);
  res.send(contractInstance.voteForCandidate(eventId, cadidates, opts));

})
var server = app.listen(8080, function () {
  console.log("express server running");
  console.log('default account: ' + web3.eth.accounts[0])
})
