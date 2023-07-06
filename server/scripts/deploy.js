// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const candidateNames = ["Zaid", "Mohammed", "Amro"]; // Replace with your desired candidate names
  const durationInMinutes = 600; // Replace with your desired voting duration in minutes

  const voting = await hre.ethers.deployContract("Voting", [
    candidateNames,
    durationInMinutes,
  ]);

  await voting.waitForDeployment();
  // console.log(voting);
  console.log("Voting contract deployed to:", voting.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
