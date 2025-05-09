"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.sendVerificationEmail = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass
    }
});
exports.sendVerificationEmail = functions.https.onCall(async (data) => {
    const { email } = data;
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Store the code in Firestore with an expiration time (5 minutes)
    const verificationRef = admin.firestore().collection('verificationCodes').doc(email);
    await verificationRef.set({
        code: verificationCode,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)) // 5 minutes
    });
    // Email content
    const mailOptions = {
        from: functions.config().email.user,
        to: email,
        subject: 'Verify your email address',
        html: `
      <h1>Email Verification</h1>
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send verification email');
    }
});
exports.verifyCode = functions.https.onCall(async (data) => {
    const { email, code } = data;
    if (!code) {
        throw new functions.https.HttpsError('invalid-argument', 'Verification code is required');
    }
    const verificationRef = admin.firestore().collection('verificationCodes').doc(email);
    const verificationDoc = await verificationRef.get();
    if (!verificationDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'No verification code found');
    }
    const verificationData = verificationDoc.data();
    const now = admin.firestore.Timestamp.now();
    if (verificationData.expiresAt.toDate() < now.toDate()) {
        throw new functions.https.HttpsError('failed-precondition', 'Verification code has expired');
    }
    if (verificationData.code !== code) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid verification code');
    }
    // Mark the email as verified
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(userRecord.uid, { emailVerified: true });
    // Delete the verification code
    await verificationRef.delete();
    return { success: true };
});
//# sourceMappingURL=index.js.map