
const hre = require("hardhat");

async function main() {
  const CourseMarketplace = await hre.ethers.getContractFactory("CourseMarketplace");
  const cm = await CourseMarketplace.deploy();

  await cm.deployed();

  console.log(
    `Deployed to ${cm.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
