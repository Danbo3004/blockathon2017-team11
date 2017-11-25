var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting, 1000, web3.toWei('0.1', 'ether'), ['Minh', 'Chien', 'Tuan', 'Nga', 'Tien']);
  //deployer.deploy(Voting, ['Minh', 'Chien', 'Tuan', 'Nga', 'Tien'], {gas: 6700000});
};
