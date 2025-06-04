const QRCode = require('qrcode');

const address = 'rCP2PFbY3VqyomvwBqe2tmfdH5h9CiUUo';
QRCode.toFile('public/xrp-qr.png', address, {
  color: { dark: '#000', light: '#FFF' },
  width: 200
}, (err) => {
  if (err) throw err;
  console.log('QR code generated as public/xrp-qr.png');
});
