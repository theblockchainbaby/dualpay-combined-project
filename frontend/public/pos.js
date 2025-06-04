const scanButton = document.getElementById('scanQR');
const qrScannerDiv = document.getElementById('qrScanner');
const statusDiv = document.getElementById('status');
const amountInput = document.getElementById('amountInput');
let html5QrCode;

scanButton.addEventListener('click', () => {
  const amount = amountInput.value;
  if (!amount || amount <= 0) {
    statusDiv.textContent = 'Please enter a valid amount.';
    return;
  }
  qrScannerDiv.classList.remove('hidden');
  html5QrCode = new Html5Qrcode('qrScanner');
  html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      statusDiv.textContent = `Scanned: ${decodedText}`;
      html5QrCode.stop();
      qrScannerDiv.classList.add('hidden');
      initiatePayment(decodedText, amount);
    },
    (error) => {
      console.log('QR Scan Error:', error);
    }
  ).catch((err) => {
    statusDiv.textContent = 'Camera access denied.';
    console.error(err);
  });
});

function initiatePayment(address, amount) {
  fetch('/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, recipient: address, currency: 'usd' })
  })
  .then(res => res.json())
  .then(data => {
    statusDiv.textContent = data.message || 'Payment sent!';
  })
  .catch(err => {
    statusDiv.textContent = 'Payment failed.';
    console.error(err);
  });
}
