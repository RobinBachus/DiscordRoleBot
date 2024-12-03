import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function sendMail(subject: string, message: string) {
	// Gmail is not the best service according to the Nodemailer docs,
	// but it should be good enough for my use-case, and is much easier to set up
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 587, false for other ports
		requireTLS: true,
		auth: {
			user: process.env.RABMAIL,
			pass: process.env.RABMAILPASS,
		},
	});

	const mailOptions = {
		from: process.env.RABMAIL,
		to: process.env.DEVMAIL,
		subject: subject,
		text: message,
	};

	return transporter.sendMail(mailOptions);
}

async function sendErrorMail(error: Error): Promise<void>;
async function sendErrorMail(errorMessage: string): Promise<void>;
async function sendErrorMail(error: string | Error) {
	if (error instanceof Error) {
		let msg: string;
		msg = "An error ocurred in the RoleAssignBot";
		msg += `Type: ${error.name}`;
		msg += `\nDescription: ${error.message}`;
		msg += `\n\nStack trace:\n ${error.stack ?? "No stack trace available"}`;
		await sendMail(error.name, msg);
	} else {
		await sendMail(error, "An unknown error ocurred in the RoleAssignBot:\n" + error);
	}
}

export { sendMail, sendErrorMail };
