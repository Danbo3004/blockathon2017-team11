pragma solidity ^0.4.4;

contract Voting {

  struct EventData {
    uint voterCount;
    // candidateId -> voteCount
    mapping (uint => uint) candidates;
  }

  struct VotingInfo {
    // candidateId -> isVotedOrNot
    mapping (uint => bool) isVotingFor;
  }

  struct VoterInfo {
    // eventId -> candidateIds
    mapping (uint => VotingInfo) votings;
    uint[] votedCandidates;
  }

  mapping (uint => EventData) events;
  mapping (address => VoterInfo) voters;

  function voteForCandidate(uint eventId, uint[] candidates) public returns(bool) {
    for(uint i = 0; i < candidates.length; i++) {
      if (!voted(eventId, candidates[i])) {
        voters[msg.sender].votings[eventId].isVotingFor[candidates[i]] = true;
        voters[msg.sender].votedCandidates.push(candidates[i]);
        events[eventId].voterCount++;
        events[eventId].candidates[candidates[i]]++;
      }
    }
  }

  function voted (uint eventId, uint candidateId) constant public returns(bool) {
    return voters[msg.sender].votings[eventId].isVotingFor[candidateId];
  }

  function totalVoteForEvent(uint eventId) constant public returns (uint) {
    return events[eventId].voterCount;
  }

  function voteInfo(address _addr, uint eventId) constant public returns (uint[]) {
    return voters[_addr].votedCandidates;
  }

  function totalVotesFor(uint eventId, uint candidateId) constant public returns (uint) {
    return events[eventId].candidates[candidateId];
  }

}