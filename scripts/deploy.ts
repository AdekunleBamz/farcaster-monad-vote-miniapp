import { ethers } from "hardhat";

async function main() {
  // MON token address on Monad testnet
  const MON_TOKEN_ADDRESS = "0x..."; // Replace with actual MON token address

  console.log("Deploying MonadVoting contract...");
  
  const MonadVoting = await ethers.getContractFactory("MonadVoting");
  const voting = await MonadVoting.deploy(MON_TOKEN_ADDRESS);
  
  await voting.waitForDeployment();
  
  const votingAddress = await voting.getAddress();
  console.log("MonadVoting deployed to:", votingAddress);

  // Add initial voting options
  console.log("Adding voting options...");
  
  const options = [
    {
      title: "Build More Mini Apps",
      description: "Create more interactive experiences on Farcaster"
    },
    {
      title: "Enhance Frame Features",
      description: "Add more capabilities to Farcaster Frames"
    },
    {
      title: "Improve User Experience",
      description: "Focus on making apps more user-friendly"
    },
    {
      title: "Expand Developer Tools",
      description: "Provide better tools for Farcaster developers"
    }
  ];

  for (const option of options) {
    const tx = await voting.addOption(option.title, option.description);
    await tx.wait();
    console.log(`Added option: ${option.title}`);
  }

  console.log("Deployment complete!");
  console.log("Contract addresses:");
  console.log("MON Token:", MON_TOKEN_ADDRESS);
  console.log("Voting Contract:", votingAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 