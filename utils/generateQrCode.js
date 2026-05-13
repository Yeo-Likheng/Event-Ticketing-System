const QRCode = require('qrcode');

/**
 * Generate a base64 QR code string from booking data.
 * @param {object} bookingData - The booking info to encode.
 * @returns {Promise<string>} Base64-encoded QR code image.
 */
const generateQrCode = async (bookingData) => {
  try {
    const payload = JSON.stringify({
      bookingId: bookingData._id,
      event: bookingData.event,
      user: bookingData.user,
      quantity: bookingData.quantity,
    });
    const qrBase64 = await QRCode.toDataURL(payload);
    return qrBase64;
  } catch (err) {
    console.error('QR code generation failed:', err.message);
    return null;
  }
};

module.exports = generateQrCode;
