console.log("BSC Lottery DApp loaded");

// 合约配置 - 这里已经为您填好了！
const CONTRACT_ADDRESS = "0x929B981d71D591DbC88c1a67601f2368c7511537";
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"better","type":"address"},{"indexed":false,"internalType":"uint256","name":"round","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"number","type":"uint256"}],"name":"NewBet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"round","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"winningNumber","type":"uint256"}],"name":"RoundCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Winner","type":"event"},{"inputs":[],"name":"ROUND_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TICKET_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"bets","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_number","type":"uint256"}],"name":"bet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"completeRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"generateRandomNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastWinningNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRoundTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"round","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"roundCompleted","outputs":[{"internalType":"boolean","name":"","type":"boolean"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"roundWinningNumbers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let lotteryContract;
let userAccount;

// 钱包连接功能
async function connectMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log("连接MetaMask...");
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            userAccount = accounts[0];
            
            // 初始化合约
            const web3 = new Web3(window.ethereum);
            lotteryContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            
            // 更新UI
            document.getElementById('wallet-status').textContent = '已连接MetaMask';
            document.getElementById('wallet-status').className = 'status connected';
            document.getElementById('account-address').textContent = 
                userAccount.substring(0, 6) + '...' + userAccount.substring(userAccount.length - 4);
            document.getElementById('account-info').style.display = 'block';
            
            // 获取余额
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [userAccount, 'latest']
            });
            const balanceBNB = (parseInt(balance) / 1e18).toFixed(4);
            document.getElementById('account-balance').textContent = balanceBNB;
            
            // 获取合约信息
            const round = await lotteryContract.methods.round().call();
            const ticketPrice = await lotteryContract.methods.TICKET_PRICE().call();
            document.getElementById('current-round').textContent = round;
            document.getElementById('ticket-price').textContent = (ticketPrice / 1e18) + ' BNB';
            
            console.log("钱包连接成功:", userAccount);
            alert('钱包连接成功！可以开始投注了');
            
        } catch (error) {
            console.error("连接失败:", error);
            alert('连接失败: ' + error.message);
        }
    } else {
        alert('请安装MetaMask钱包!');
    }
}

function connectWalletConnect() {
    alert('WalletConnect功能即将推出！');
}

function connectTP() {
    if (typeof window.ethereum !== 'undefined') {
        connectMetamask();
    } else if (typeof window.tokenpocket !== 'undefined') {
        alert('检测到TokenPocket，请使用应用内浏览器打开');
    } else {
        alert('请使用TokenPocket应用内浏览器访问');
    }
}

// 投注功能
async function placeBet() {
    if (!userAccount) {
        alert('请先连接钱包!');
        return;
    }
    
    const betNumber = document.getElementById('bet-number').value;
    if (!betNumber || betNumber < 0 || betNumber > 999) {
        alert('请输入有效的三位数(0-999)!');
        return;
    }
    
    try {
        // 获取投注价格
        const ticketPrice = await lotteryContract.methods.TICKET_PRICE().call();
        
        // 显示交易状态
        document.getElementById('transaction-status').style.display = 'block';
        document.getElementById('status-text').textContent = '发送交易...';
        
        // 发送投注交易
        const transaction = await lotteryContract.methods.bet(betNumber).send({
            from: userAccount,
            value: ticketPrice,
            gas: 300000
        });
        
        document.getElementById('status-text').textContent = '投注成功!';
        document.getElementById('tx-hash').textContent = transaction.transactionHash;
        alert('投注成功! 交易哈希: ' + transaction.transactionHash);
        
    } catch (error) {
        console.error('投注失败:', error);
        document.getElementById('status-text').textContent = '投注失败';
        alert('投注失败: ' + error.message);
    }
}

function generateRandomNumber() {
    const randomNum = Math.floor(Math.random() * 1000);
    document.getElementById('bet-number').value = randomNum;
    alert('生成随机数: ' + randomNum);
}

function checkWinnings() {
    alert('中奖检查功能需要连接到区块链');
}

// 倒计时功能
function startCountdown() {
    let timeLeft = 5 * 60;
    const countdownElement = document.getElementById('countdown');
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (--timeLeft < 0) {
            clearInterval(timer);
            countdownElement.textContent = "开奖中...";
            setTimeout(() => {
                alert('开奖完成！请检查是否中奖');
                timeLeft = 5 * 60;
                startCountdown();
            }, 3000);
        }
    }, 1000);
}

// 页面加载时初始化
window.addEventListener('load', function() {
    console.log("页面加载完成");
    startCountdown();
    
    // 监听钱包变化
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                console.log("用户断开钱包连接");
                document.getElementById('wallet-status').textContent = '未连接钱包';
                document.getElementById('wallet-status').className = 'status disconnected';
                document.getElementById('account-info').style.display = 'none';
                userAccount = null;
                lotteryContract = null;
            }
        });
        
        window.ethereum.on('chainChanged', function(chainId) {
            // 网络切换时重新加载页面
            window.location.reload();
        });
    }
});
