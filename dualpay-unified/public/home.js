let html5QrCode;
let isScannerRunning = false;
const actionModal = document.getElementById('actionModal');
const sendPayOption = document.getElementById('sendPayOption');
const requestOption = document.getElementById('requestOption');
const sendPayContent = document.getElementById('sendPayContent');
const requestContent = document.getElementById('requestContent');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');

const ws = new WebSocket('ws://192.168.0.210:8080');
  const xrpBalanceSpan = document.getElementById('xrpBalance');
  const usdBalanceSpan = document.getElementById('usdBalance');

  ws.onopen = () => {
    console.log('WebSocket connection established');
    fetch('/balance')
      .then((response) => response.json())
      .then((data) => {
        console.log('Initial balance fetched:', data);
        xrpBalanceSpan.textContent = data.xrpBalance || 'N/A';
        usdBalanceSpan.textContent = data.usdBalance ? `= $${data.usdBalance} USD` : '= $N/A USD';
      })
      .catch((error) => {
        console.error('Error fetching initial balance:', error);
        xrpBalanceSpan.textContent = 'Error';
        usdBalanceSpan.textContent = '= $Error';
      });
  };

  ws.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    try {
      const data = JSON.parse(event.data);
      console.log('Parsed WebSocket data:', data);
      if (data.type === 'balance' && xrpBalanceSpan && usdBalanceSpan) {
        console.log('Updating balance:', data.xrpBalance, data.usdBalance);
        xrpBalanceSpan.textContent = data.xrpBalance || 'N/A';
        usdBalanceSpan.textContent = data.usdBalance ? `= $${data.usdBalance} USD` : '= $N/A USD';
      } else if (data.type === 'payment') {
        console.log('Payment received:', data.status, data.tx.hash);
        showToast(`Payment ${data.status}: ${data.tx.hash}`);
      } else if (data.type === 'transaction') {
        console.log('Adding transaction to history:', data.transaction);
        addTransaction(data.transaction);
        showToast(`New transaction: ${data.transaction.amount} XRP to ${data.transaction.name}`);
      } else {
        console.log('Unknown WebSocket message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      xrpBalanceSpan.textContent = 'Error';
      usdBalanceSpan.textContent = '= $Error';
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  document.getElementById('payRequestButton').addEventListener('click', () => {
    console.log('Pay/Request button clicked');
    actionModal.style.display = 'block';
    showOption('sendPay');
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    console.log('Close modal clicked');
    actionModal.style.display = 'none';
    if (isScannerRunning && html5QrCode) {
      html5QrCode.stop().then(() => {
        isScannerRunning = false;
        console.log('QR scanner stopped');
      }).catch((err) => {
        console.error('Error stopping QR scanner:', err);
      });
    }
  });

  sendPayOption.addEventListener('click', () => showOption('sendPay'));
  requestOption.addEventListener('click', () => showOption('request'));

  document.getElementById('sendButton').addEventListener('click', () => {
    console.log('Send button clicked');
    const recipient = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('sendAmount').value;
    const currency = document.getElementById('sendCurrency').value;

    if (!recipient || !amount || !currency) {
      showToast('Please fill in all fields');
      return;
    }

    const payload = { recipient, amount, currency };
    console.log('Sending payment:', payload);
    fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Payment response:', data);
        showToast(data.message);
        if (data.txHash) {
          document.getElementById('recipientAddress').value = '';
          document.getElementById('sendAmount').value = '';
          actionModal.style.display = 'none';
        }
      })
      .catch((error) => {
        console.error('Payment error:', error);
        showToast('Payment failed: ' + error.message);
      });
  });
});

function showOption(option) {
  console.log('showOption called with:', option);
  if (option === 'sendPay') {
    sendPayOption.classList.add('active');
    requestOption.classList.remove('active');
    sendPayContent.classList.add('active');
    requestContent.classList.remove('active');
    startQrScanner();
  } else {
    sendPayOption.classList.remove('active');
    requestOption.classList.add('active');
    sendPayContent.classList.remove('active');
    requestContent.classList.add('active');
    if (isScannerRunning && html5QrCode) {
      html5QrCode.stop().then(() => {
        isScannerRunning = false;
        console.log('QR scanner stopped');
      }).catch((err) => {
        console.error('Error stopping QR scanner:', err);
      });
    }
  }
}

function startQrScanner() {
  console.log('Starting QR scanner');
  if (typeof Html5Qrcode === 'undefined') {
    console.error('Html5Qrcode not available');
    showToast('QR scanning not available. Please enter manually.');
    manualWalletInput();
    return;
  }
  html5QrCode = new Html5Qrcode('qrScanner');
  const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
  html5QrCode.start(
    { facingMode: 'environment' },
    qrConfig,
    (decodedText) => {
      console.log('QR Code scanned:', decodedText);
      document.getElementById('recipientAddress').value = decodedText;
      html5QrCode.stop().then(() => {
        isScannerRunning = false;
        console.log('QR scanner stopped after scan');
      }).catch((err) => {
        console.error('Error stopping QR scanner:', err);
      });
      actionModal.style.display = 'none';
      showToast('Recipient address scanned successfully');
    },
    (error) => {
      if (!error.includes('No barcode or QR code detected')) {
        console.log('QR scan error:', error);
      }
    }
  ).then(() => {
    isScannerRunning = true;
    showToast('Scanning for QR code...');
  }).catch((err) => {
    console.error('Failed to start QR scanner:', err);
    showToast('Failed to start QR scanner. Please enter manually.');
    manualWalletInput();
  });
}

function manualWalletInput() {
  console.log('Switching to manual wallet input');
  if (isScannerRunning && html5QrCode) {
    html5QrCode.stop().then(() => {
      isScannerRunning = false;
      console.log('QR scanner stopped for manual input');
    }).catch((err) => {
      console.error('Error stopping QR scanner:', err);
    });
  }
}

function addTransaction(transaction) {
  console.log('addTransaction called with:', transaction);
  const transactionList = document.getElementById('transactionList');
  const li = document.createElement('li');
  li.className = transaction.type;
  li.innerHTML = `
    <span class="name">${transaction.name}</span>
    <span class="date">${transaction.date}</span>
    <span class="amount">${transaction.amount} XRP</span>
  `;
  transactionList.prepend(li);
  if (transactionList.children.length > 5) {
    transactionList.removeChild(transactionList.lastChild);
  }
}

function showToast(message) {
  console.log('Showing toast:', message);
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
