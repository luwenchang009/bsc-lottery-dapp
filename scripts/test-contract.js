async function main() {
  // 连接到已部署的合约
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = Lottery.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  console.log("连接到合约:", lottery.address);
  
  // 测试读取合约信息
  const owner = await lottery.owner();
  const round = await lottery.round();
  const ticketPrice = await lottery.TICKET_PRICE();
  
  console.log("合约所有者:", owner);
  console.log("当前轮次:", round.toString());
  console.log("投注价格:", ethers.utils.formatEther(ticketPrice), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });