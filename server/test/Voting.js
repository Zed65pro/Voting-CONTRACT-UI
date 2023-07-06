const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Voting", function () {
  async function deployLoadingFixture() {
    const candidateNames = ["Candidate 1", "Candidate 2"];
    const durationInMinutes = 60;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const votingContract = await Voting.deploy(
      candidateNames,
      durationInMinutes
    );

    // await votingContract.deployed();

    return { votingContract, owner, otherAccount, candidateNames };
  }

  it("should add candidates correctly", async function () {
    const { votingContract, candidateNames } = await loadFixture(
      deployLoadingFixture
    );

    const candidateName = "Candidate 3";
    await votingContract.addCandidate(candidateName);

    const candidates = await votingContract.getAllVotesOfCandidates();
    expect(candidates.length).to.equal(candidateNames.length + 1);
    expect(candidates[candidates.length - 1].name).to.equal(candidateName);
    expect(candidates[candidates.length - 1].voteCount).to.equal(0);
  });

  it("should vote for a candidate correctly", async function () {
    const { votingContract, owner } = await loadFixture(deployLoadingFixture);
    const candidateIndex = 1;

    await votingContract.vote(candidateIndex);
    const candidates = await votingContract.getAllVotesOfCandidates();
    expect(candidates[candidateIndex].voteCount).to.equal(1);
    expect(await votingContract.isVoted(owner)).to.equal(true);
  });

  it("should not allow duplicate voting", async function () {
    const { votingContract } = await loadFixture(deployLoadingFixture);
    const candidateIndex = 0;

    await votingContract.vote(candidateIndex);
    await expect(votingContract.vote(candidateIndex)).to.be.revertedWith(
      "You have already voted."
    );
  });

  it("should get correct voting status", async function () {
    const { votingContract } = await loadFixture(deployLoadingFixture);
    const votingStatus = await votingContract.getVotingStatus();
    expect(votingStatus).to.equal(true);
  });

  it("should get remaining time correctly", async function () {
    const { votingContract } = await loadFixture(deployLoadingFixture);
    const remainingTime = await votingContract.getRemainingTime();
    expect(remainingTime).to.be.above(0);
  });
});
