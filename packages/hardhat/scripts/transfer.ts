const { ethers, network } = require("hardhat");

async function main() {
  // Address of the account you want to impersonate
  const whaleWalletAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik's wallet for example

  // Impersonate the account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whaleWalletAddress],
  });

  const impersonatedSigner = await ethers.getSigner(whaleWalletAddress);

  const accounts = await ethers.getSigners();
  const attackerAddress = accounts[0];

  // Log the balance of the impersonated account
  const balance = await ethers.provider.getBalance(whaleWalletAddress);
  const attacker = await ethers.provider.getBalance(attackerAddress);
  console.log(`Balance of whale (${whaleWalletAddress}): ${ethers.formatEther(balance)} ETH ${ethers.formatEther(attacker)} ETH`);

  const tx = await impersonatedSigner.sendTransaction({
    to: whaleWalletAddress,
    value: ethers.parseEther("50.0"), // Sends exactly 50.0 ether
  });


  // Wait for the transaction to be mined
  await tx.wait();

  // Log the new balance after the transaction
  const newBalance = await ethers.provider.getBalance(whaleWalletAddress);
  const newAttacker = await ethers.provider.getBalance(attackerAddress);
  console.log(`New balance of whale: ${ethers.formatEther(newBalance)} ETH ${ethers.formatEther(newAttacker)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });