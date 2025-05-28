const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

// Create transporter with your SMTP config
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false // Only if you have certificate issues
    }
  });
};

// Email template for congratulations
const getCongratulatoryEmailTemplate = (employeeName, quarter, category) => {
  return {
    subject: `Congratulations! You've achieved ${category} for Quarter ${quarter}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #28a745; margin: 0;">Congratulations!</h1>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2>Dear ${employeeName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">
            We are thrilled to inform you that you have <strong>achieved ${category}</strong> for <strong>Quarter ${quarter}</strong>!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Your hard work, dedication, and outstanding performance have not gone unnoticed. 
            This recognition is a testament to your valuable contributions to our organization.
          </p>
          
          <div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #495057; font-size: 18px;">
              🏆 Achievement: <span style="color:rgb(123, 167, 40);">${category}</span>
            </p>
            <p style="margin: 10px 0 0 0; font-weight: bold; color: #495057;">
              📅 Quarter: ${quarter}
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            This ${category} recognition places you among our top performers for this quarter. 
            We look forward to your continued excellence and contribution to our team's success.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            <strong>${process.env.FROM_NAME}</strong>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
          <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  };
};
// Function to send individual email
const sendEmail = async (toEmail, employeeName, quarter, category) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = getCongratulatoryEmailTemplate(employeeName, quarter, category);
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: toEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${toEmail}:`, result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Function to send mass emails
const sendMassEmails = async (employees, quarter) => {
  const results = [];
  
  // console.log(`Starting to send emails to ${employees.length} employees for Quarter ${quarter}`);
  
  for (const employee of employees) {
    if (employee.mail && employee.name) {
      const result = await sendEmail(employee.mail, employee.name, quarter, employee.category);
      results.push({
        empid: employee.empid,
        email: employee.mail,
        name: employee.name,
        ...result
      });
      
      // Add small delay to avoid overwhelming SMTP server
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      console.warn(`Skipping employee ${employee.empid}: Missing email or name`);
      results.push({
        employeeId: employee.empid,
        success: false,
        error: 'Missing email or name'
      });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`Email sending completed: ${successCount} successful, ${failCount} failed`);
  
  return {
    totalEmails: employees.length,
    successCount,
    failCount,
    results
  };
};

module.exports = {
  sendEmail,
  sendMassEmails
};