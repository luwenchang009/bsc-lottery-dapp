async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("使用账户部署合约:", deployer.address);
  console.log("账户余额:", (await deployer.getBalance()).toString());

  // 获取合约工厂
  const Lottery = await ethers.getContractFactory("Lottery");
  
  // 部署合约
  const lottery = await Lottery.deploy();
  
  console.log("彩票合约部署到地址:", lottery.address);
  
  // 等待部署确认
  await lottery.deployed();
  console.log("合约部署完成！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });