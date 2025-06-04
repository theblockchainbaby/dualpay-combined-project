// public/client.js
// DOM elements
const xrpBalanceElement = document.getElementById('xrpBalance');
const usdBalanceElement = document.getElementById('usdBalance');
const transactionList = document.getElementById('transactionList');
const payRequestButton = document.getElementById('payRequestButton');
const actionModal = document.getElementById('actionModal');
const closeModal = document.getElementById('closeModal');
const sendPayOption = document.getElementById('sendPayOption');
const requestOption = document.getElementById('requestOption');
const sendPayContent = document.getElementById('sendPayContent');
const sendButton = document.getElementById('sendButton');
const recipientAddressInput = document.getElementById('recipientAddress');
const sendAmountInput = document.getElementById('sendAmount');
const sendCurrencySelect = document.getElementById('sendCurrency');

// Debug: Log if elements are found
console.log('payRequestButton:', payRequestButton);
console.log('actionModal:', actionModal);
console.log('closeModal:', closeModal);
console.log('sendPayOption:', sendPayOption);
console.log('requestOption:', requestOption);
console.log('sendButton:', sendButton);

// WebSocket connection
const ws = new WebSocket('ws://localhost:8081');

ws.onopen = () => {
    console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'balance') {
        // Format XRP balance with full precision
        xrpBalanceElement.textContent = `${parseFloat(data.xrpBalance).toFixed(6)} XRP`;
        // Format USD balance with 2 decimal places and commas
        const usdValue = parseFloat(data.usdBalance).toFixed(2);
        const formattedUsd = usdValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        usdBalanceElement.textContent = `=$${formattedUsd}`;
    } else if (data.type === 'transaction') {
        addTransaction(data.transaction);
    } else if (data.type === 'history') {
        transactionList.innerHTML = '';
        data.transactions.forEach(addTransaction);
    }
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    xrpBalanceElement.textContent = 'Error';
    usdBalanceElement.textContent = '=$Error';
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
    xrpBalanceElement.textContent = 'Error';
    usdBalanceElement.textContent = '=$Error';
};

function addTransaction(tx) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="avatar">${tx.name.charAt(0)}</div>
        <div class="transaction-info">
            <div class="name">${tx.name}</div>
            <div class="date">${tx.date}</div>
        </div>
        <div class="transaction-info amount ${tx.type}">${tx.amount} XRP</div>
    `;
    transactionList.insertBefore(li, transactionList.firstChild);
}

// Event listeners for buttons
if (payRequestButton) {
    payRequestButton.addEventListener('click', () => {
        console.log('Pay or Request button clicked');
        if (actionModal) {
            actionModal.style.display = 'block';
            if (sendPayContent) sendPayContent.classList.add('active');
            if (sendPayOption) sendPayOption.classList.add('active');
            if (requestOption) requestOption.classList.remove('active');
        } else {
            console.error('actionModal not found');
        }
    });
} else {
    console.error('payRequestButton not found');
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        console.log('Close button clicked');
        if (actionModal) {
            actionModal.style.display = 'none';
        } else {
            console.error('actionModal not found');
        }
    });
} else {
    console.error('closeModal not found');
}

if (sendPayOption) {
    sendPayOption.addEventListener('click', () => {
        console.log('Send/Pay option clicked');
        if (sendPayContent) sendPayContent.classList.add('active');
        if (requestContent) document.getElementById('requestContent').classList.remove('active');
        if (sendPayOption) sendPayOption.classList.add('active');
        if (requestOption) requestOption.classList.remove('active');
    });
} else {
    console.error('sendPayOption not found');
}

if (requestOption) {
    requestOption.addEventListener('click', () => {
        console.log('Request option clicked');
        if (sendPayContent) sendPayContent.classList.remove('active');
        if (requestContent) document.getElementById('requestContent').classList.add('active');
        if (sendPayOption) sendPayOption.classList.remove('active');
        if (requestOption) requestOption.classList.add('active');
    });
} else {
    console.error('requestOption not found');
}

if (sendButton) {
    sendButton.addEventListener('click', async () => {
        console.log('Send button clicked');
        const recipient = recipientAddressInput.value;
        const amount = sendAmountInput.value;
        const currency = sendCurrencySelect.value;

        if (!recipient || !amount) {
            alert('Please enter a recipient address and amount');
            return;
        }

        try {
            const response = await fetch('/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient, amount, currency })
            });
            const result = await response.json();
            if (response.ok) {
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = result.message;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
                if (actionModal) actionModal.style.display = 'none';
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
} else {
    console.error('sendButton not found');
}
