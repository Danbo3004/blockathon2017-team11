// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/bootstrap.min.css";
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts);

let candidates = {};
let candidateName = {3 : 'Minh', 4 : 'Chien', 5 : 'Tuan', 6: 'Nga', 7: 'Tien'};
let candidateKeys = [3,4,5,6,7];
let tokenPrice = null;

let eventId = 123;
let prefixDivId = 'candidate';

window.voteForCandidate = function(candidate) {
  let candidateId = $("#candidate").val();
  $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
  $("#candidate").val("");
  let candidateIds = candidateId;
  Voting.deployed().then(function(contractInstance) {
    contractInstance.voteForCandidate(eventId, candidateIds, {gas: 4600000, from: web3.eth.accounts[0]}).then(function() {
      return contractInstance.totalVotesFor.call(candidateId).then(function(v) {
        $("#" + prefixDivId + candidateId).html(v.toString());
        updateTotalVoteByEventId(eventId);
        $("#msg").html("");
      });
    });
  });
}

window.lookupVoterInfo = function() {
  let address = $("#voter-info").val();
  $("#votes-cast").html("");
  Voting.deployed().then(function(contractInstance) {
    contractInstance.voteInfo.call(address).then(function(v) {
      for(let i=0; i < v.length; i++) {
        $("#votes-cast").append(candidateName[v[i]] + "<br>");
      }
    });
  });
}

/* Instead of hardcoding the candidates hash, we now fetch the candidate list from
 * the blockchain and populate the array. Once we fetch the candidates, we setup the
 * table in the UI with all the candidates and the votes they have received.
 */
function populateCandidates() {
  Object.keys(candidateName).forEach(function(key) {
    candidates[candidateName[key]] = prefixDivId + key;
  });
  setupCandidateRows();
  populateCandidateVotes();
  populateTokenData();
  updateTotalVoteByEventId(eventId);
}

function updateTotalVoteByEventId(eventId) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.totalVoteForEvent.call(eventId).then(function(v) {
      $('#total_votes').html(v.toString());
    });
  });
}

function populateCandidateVotes() {
  Object.keys(candidateName).forEach(function(key) {
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(key).then(function(v) {
        $("#" + candidates[candidateName[key]]).html(v.toString());
      });
    });
  });
  // for (var i = 0; i < candidates.length; i++) {
  //   let cadId = candidateKeys[i];
  //   Voting.deployed().then(function(contractInstance) {
  //     contractInstance.totalVotesFor.call(eventId, cadId).then(function(v) {
  //       $("#" + candidates[i]).html(v.toString());
  //     });
  //   });
  // }
}

function setupCandidateRows() {
  Object.keys(candidates).forEach(function(key) {
    $("#candidate-rows").append("<tr><td>" + key + "</td><td id='" + candidates[key] + "'></td></tr>");
  });
  Object.keys(candidateName).forEach(function(key) {
    $("#candidate").append("<option value='" + key + "'>" + candidateName[key]+ "</option> ");
  });


}

/* Fetch the total tokens, tokens available for sale and the price of
 * each token and display in the UI
 */
function populateTokenData() {
  // Voting.deployed().then(function(contractInstance) {
  //   contractInstance.totalTokens().then(function(v) {
  //     $("#tokens-total").html(v.toString());
  //   });
  //   contractInstance.tokensSold.call().then(function(v) {
  //     $("#tokens-sold").html(v.toString());
  //   });
  //   contractInstance.tokenPrice().then(function(v) {
  //     tokenPrice = parseFloat(web3.fromWei(v.toString()));
  //     $("#token-cost").html(tokenPrice + " Ether");
  //   });
  //   web3.eth.getBalance(contractInstance.address, function(error, result) {
  //     $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
  //   });
  // });
}

$( document ).ready(function() {
  $('#h1_title').html("BẠN CHỌN AI?");
  // console.log(Voting._json.networks);
  // console.log(Voting.network_id);
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);
  populateCandidates(eventId);

});
