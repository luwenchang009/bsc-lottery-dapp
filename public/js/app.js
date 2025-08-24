// 简化版前端 - 手动设置合约信息
const contractAddress = "0x929B981d71D591DbC88c1a67601f2368c7511537";
const ticketPrice = "0.001"; // BNB

let web3;
let userAccount;

// 初始化
async function init() {
    console.log("初始化DApp...");
    
    if (typeof window.ethereum !== 'undefined') {
        console.log("检测到MetaMask");
        web3 = new Web3(window.ethereum);
        setupEventListeners();
        await checkNetwork();
        
        // 设置固定的合约信息
        document.getElementById('ticketPrice').textContent = ticketPrice + ' BNB';
        
    } else {
        alert('请安装MetaMask钱包!');
    }
}

// 检查网络
async function checkNetwork() {
    try {
        const chainId = await web3.eth.getChainId();
        console.log("当前网络Chain ID:", chainId);
        // BSC测试网chainId是97
        if (chainId !== 97) {
            alert('请切换到BSC测试网络!');
        }
    } catch (error) {
        console.error('检查网络失败:', error);
    }
}

// 设置事件监听
function setupEventListeners() {
    console.log("设置事件监听器...");
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('placeBet').addEventListener('click', placeBet);
}

// 连接钱包
async function connectWallet() {
    try {
        console.log("连接钱包...");
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        userAccount = accounts[0];
        console.log("钱包已连接:", userAccount);
        
        document.getElementById('walletAddress').textContent = 
            userAccount.substring(0, 6) + '...' + userAccount.substring(userAccount.length - 4);
        document.getElementById('walletInfo').style.display = 'block';
        document.getElementById('connectWallet').textContent = '已连接';
        
        await updateWalletBalance();
        
    } catch (error) {
        console.error("连接钱包失败:", error);
        alert('连接钱包失败: ' + error.message);
    }
}

// 更新钱包余额
async function updateWalletBalance() {
    if (userAccount) {
        try {
            const balance = await web3.eth.getBalance(userAccount);
            document.getElementById('walletBalance').textContent = web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('获取余额失败:', error);
        }
    }
}

// 投注功能 - 简化版
async function placeBet() {
    if (!userAccount) {
        alert('请先连接钱包!');
        return;
    }
    
    const betNumber = document.getElementById('betNumber').value;
    if (!betNumber || betNumber < 0 || betNumber > 999) {
        alert('请输入有效的三位数(0-999)!');
        return;
    }
    
    alert('投注功能需要完整的合约ABI才能工作。当前为演示模式。');
    
    // 显示模拟交易状态
    document.getElementById('transactionStatus').style.display = 'block';
    document.getElementById('statusText').textContent = '演示模式';
    document.getElementById('txHash').textContent = '0x...（需要完整ABI）';
    document.getElementById('blockConfirmations').textContent = '0';
}

// 页面加载时初始化
window.addEventListener('load', init);

// 添加网络变化监听
if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    });
    
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            console.log('请连接MetaMask');
        } else {
            userAccount = accounts[0];
            updateWalletBalance();
        }
    });
}

// 添加倒计时功能
function startCountdown() {
    let timeLeft = 5 * 60; // 5分钟
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.textContent = "开奖中...";
            // 这里可以添加开奖逻辑
            setTimeout(() => {
                countdownElement.textContent = "05:00";
                startCountdown();
            }, 3000);
        }
        
        timeLeft--;
    }, 1000);
}

// 启动倒计时
startCountdown();