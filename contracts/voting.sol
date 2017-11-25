pragma solidity ^0.4.11;

contract Voting {

  struct voter {
    uint eventId;
    address voterAddress;
    uint candidateId;
  }

  // mapping (address => uint[]) votesCandidates;
  voter[] public votesCandidates;
  mapping (uint => uint) public numberOfVoteCandidates;
  mapping (uint => uint) public numberOfVoteEventId;

  function voteForCandidate(uint eventId, uint[] candidates) public {
    voter tmp;
    for(uint i = 0; i < candidates.length; i++) {
      tmp.voterAddress  = msg.sender;
      tmp.candidateId   = candidates[i];
      tmp.eventId       = eventId;
      votesCandidates.push(tmp);
      numberOfVoteCandidates[candidates[i]] += 1;
      numberOfVoteEventId[eventId] += 1;
    }
    /*
    require (not_voted(candidates));
    votesCandidates[msg.sender].push(candidates);
    numberOfVoteCandidates[candidates] += 1;
    numberOfVoteEventId[eventId] += 1;*/
  }

  function totalVotesFor(uint candidateId) public returns (uint) {
    return numberOfVoteCandidates[candidateId];
  }

  function totalVoteForEvent(uint eventId) public returns (uint) {
    return numberOfVoteEventId[eventId];
  }

  function voteInfo(address _addr) public returns (uint[]) {
    //return votesCandidates[_addr];
  }

  // function not_voted (uint candidate) constant public returns(bool) {
  //   for(uint i = 0; i < votesCandidates[msg.sender].length; i++) {
  //     if(votesCandidates[msg.sender][i] == candidate) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

}
