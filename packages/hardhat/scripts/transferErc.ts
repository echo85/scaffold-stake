const { ethers, network } = require("hardhat");

async function main() {
  // Address of the account you want to impersonate
  const whaleWalletAddress = "0xfE175398f22f267Ea8f5718e5848ef1e0047bF32"; // Vitalik's wallet for example
  const Token = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  // Impersonate the account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whaleWalletAddress],
  });

  const impersonatedSigner = await ethers.getSigner(whaleWalletAddress);
  const tokenContract = await ethers.getContractAt("IERC20", Token);
  const decimals = 6;

  const accounts = await ethers.getSigners();
  const attackerAddress = accounts[0];


  // Log the balance of the impersonated account
  const balance =  await tokenContract.balanceOf(whaleWalletAddress);
  const attacker = await tokenContract.balanceOf(attackerAddress);
  console.log(`Balance of whale (${whaleWalletAddress}): ${ethers.formatUnits(balance,decimals)} DAI ${ethers.formatUnits(attacker,decimals)} DAI`);

  const tx = await tokenContract.connect(impersonatedSigner).transfer(accounts[0].address, ethers.parseUnits("100000", decimals));


  // Wait for the transaction to be mined
  await tx.wait();

  // Log the new balance after the transaction
  const newBalance = await tokenContract.balanceOf(whaleWalletAddress);
  const newAttacker = await tokenContract.balanceOf(attackerAddress);
  console.log(`Balance of whale (${whaleWalletAddress}): ${ethers.formatUnits(newBalance,decimals)} DAI ${ethers.formatUnits(newAttacker,decimals)} DAI`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });