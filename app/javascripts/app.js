// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/bootstrap.min.css";
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// BLOCHAINLAB
// 0x4EA6843F2b8208662570bd34906FAf85Ff40a0CC
// !@superpassword

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
let candidateName = {1 : 'Nguyen Thi Thu', 2 : 'Bui Mong Cam', 3 : 'Vu Thi Tuyet Trang', 4: 'Dang Thi Thu Thao'};
let candidateKeys = [1,2,3,4];
let tokenPrice = null;

let eventId = 123;
let prefixDivId = 'candidate';

// var addressTest = web3.eth.accounts[0];

window.voteForCandidate = function() {
  var candidateIds = $("#candidate_id input:checkbox:checked").map(function(){
    return $(this).val();
  }).get();
  if (candidateIds.length <= 0) {
    alert('Vui lòng chọn ít nhất một lựa chọn.');
    return;
  }
  $('#txt_transaction').html('');
  $('#loading_container').show();
  Voting.deployed().then(function(contractInstance) {
    contractInstance.voteForCandidate(eventId, candidateIds, {gas: 4600000, from: '0x4EA6843F2b8208662570bd34906FAf85Ff40a0CC'}).then(function(v) {
      $('#txt_transaction').html('Txt: <a href="https://rinkeby.etherscan.io/tx/' + v.tx + '">' + v.tx + '</a>');
      for (let i = 0; i < candidateIds.length ; i++) {
        contractInstance.totalVotesFor.call(eventId, candidateIds[i]).then(function(v) {
          $("#" + prefixDivId + candidateIds[i]).html(v.toString());
          updateTotalVoteByEventId(eventId);
          $("#msg").html("");
        });
      }
      $('#candidate_id input:checkbox').each(function () {
        $(this).attr('checked', false);
      });
      $('#loading_container').hide();
      alert("Bình chọn thành công.....");
    });
  });
}

window.lookupVoterInfo = function() {
  let address = $("#voter-info").val().toString().trim();
  $("#votes-cast").html("");
  Voting.deployed().then(function(contractInstance) {
    contractInstance.voteInfo.call(address, eventId).then(function(v) {
      var html_txt = '<ul class="list-group">';
      for(let i=0; i < v.length; i++) {
        html_txt += '<li class="list-group-item">' + candidateName[v[i]] + "</li>";
      }
      html_txt += '</ul>';
      $("#votes-cast").append(html_txt);
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
      $('#total_votes').html("Tổng lượt tham bình chọn: " + v.toString());
    });
  });
}

function populateCandidateVotes() {
  Object.keys(candidateName).forEach(function(key) {
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(eventId, key).then(function(v) {
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
    console.warn("No web3 detected. Falling back to  http://www.blockathon.asia:8545/. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider(" http://www.blockathon.asia:8545/"));
  }

  Voting.setProvider(web3.currentProvider);
  populateCandidates(eventId);

  $(".img-check").click(function(){
    $(this).toggleClass("check");
  });
});
