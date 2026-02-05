/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate OTP expiry time (15 minutes from now)
 * @returns {Date} Expiry date object
 */
const getOtpExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    return expiry;
};

module.exports = {
    generateOTP,
    getOtpExpiry
};
