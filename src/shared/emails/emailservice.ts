import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// Configure handlebars
const handlebarOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./src/shared/emails/templates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/shared/emails/templates/'),
    extName: '.hbs',
};

// Apply the template engine to the transporter
transporter.use('compile', hbs(handlebarOptions));

// Email service class
export class EmailService {
    // Send verification code
    static async sendVerificationEmail(email: string, verificationCode: string, name:string, expiresIn:string): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification Code',
                template: 'verification',
                context: {
                    verificationCode,
                    email,
                    name,
                    expiryTime: expiresIn
                }
            });
            return true;
        } catch (error) {
            console.error('Error sending verification email:', error);
            return false;
        }
    }

    // Send welcome email
    static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to Our Platform!',
                template: 'welcome',
                context: {
                    name,
                    email
                }
            });
            return true;
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return false;
        }
    }

    static async sendConfirmationemail(name: string, orderId: string, email:string): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Order Confirmation',
                template: 'orderconfirmation',
                context: {
                    name,
                    orderId
                }
            });
            return true;
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            return false;
        }
    }
}