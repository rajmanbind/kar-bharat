export const generateOTPEmailTemplate = ({
    userName,
    otp,
    supportLink,
    otpExpiryMinutes
  }) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="text-align: center;">
            <p style="font-size: 30px; line-height: 20px; font-weight: 600;">Verify Your Email</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">                
            <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${userName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">Please use the following OTP to verify your email address:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background-color: #f0f7ff; border-radius: 5px; padding: 15px 25px; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #4a90e2;">
                ${otp}
              </div>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #e74c3c;">
              ⚠️ This OTP will expire in ${otpExpiryMinutes} minutes.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">If you didn't request this OTP, please ignore this email or <a href="${supportLink}" style="color: #4a90e2; text-decoration: none;">contact support</a> if you have concerns.</p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>Karvix</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0 0 10px;">
             Our Address
            </p>
            <p style="margin: 0;">
              <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
              <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
  
  export const otpEmailTemplate = {
    label: "Email Verification OTP",
    generateSubject: () => "🔐 Your Email Verification Code",
    generateBody: (data) => generateOTPEmailTemplate(data)
  };