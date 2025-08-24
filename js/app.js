console.log("BSC Lottery DApp loaded");

// 钱包连接功能
async function connectMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log("连接MetaMask...");
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            const account = accounts[0];
            
            // 更新UI
            document.getElementById('wallet-status').textContent = '已连接MetaMask';
            document.getElementById('wallet-status').className = 'status connected';
            document.getElementById('account-address').textContent = 
                account.substring(0, 6) + '...' + account.substring(account.length - 4);
            document.getElementById('account-info').style.display = 'block';
            
            // 获取余额
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });
            const balanceBNB = (parseInt(balance) / 1e18).toFixed(4);
            document.getElementById('account-balance').textContent = balanceBNB;
            
            console.log("钱包连接成功:", account);
            alert('钱包连接成功！');
            
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
function placeBet() {
    const betNumber = document.getElementById('bet-number').value;
    if (!betNumber || betNumber < 0 || betNumber > 999) {
        alert('请输入有效的三位数(0-999)!');
        return;
    }
    
    // 显示交易状态
    document.getElementById('transaction-status').style.display = 'block';
    document.getElementById('status-text').textContent = '投注中...';
    
    // 模拟交易
    setTimeout(() => {
        document.getElementById('status-text').textContent = '投注成功!';
        document.getElementById('tx-hash').textContent = '0x' + Math.random().toString(16).substr(2, 64);
        alert('投注成功! 数字: ' + betNumber.padStart(3, '0'));
    }, 2000);
}

function generateRandomNumber() {
    const randomNum = Math.floor(Math.random() * 1000);
    document.getElementById('bet-number').value = randomNum;
    alert('生成随机数: ' + randomNum);
}

function checkWinnings() {
    alert('中奖检查功能需要合约连接');
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
                alert('开奖完成！随机中奖号码: ' + Math.floor(Math.random() * 1000));
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
    
    // 添加事件监听
    document.getElementById('connectWallet')?.addEventListener('click', connectMetamask);
    document.getElementById('placeBet')?.addEventListener('click', placeBet);
    
    // 监听钱包变化
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                console.log("用户断开钱包连接");
                document.getElementById('wallet-status').textContent = '未连接钱包';
                document.getElementById('wallet-status').className = 'status disconnected';
                document.getElementById('account-info').style.display = 'none';
            }
        });
    }
});
