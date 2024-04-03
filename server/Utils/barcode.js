const QRCode = require('qrcode');

module.exports = async function generateQRCodeBuffer(data) {
    try {
        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(data.toString())
        return qrCodeData;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
}
