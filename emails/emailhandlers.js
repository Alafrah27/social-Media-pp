import { mailtrapClient, sender } from "../lib/mailtrap.js";
import {
  createWelcomeEmailTemplate,
  createCmmentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
} from "../emails/emailtemplate.js";
export async function sendWelcomeEmail(email, name, username, profileUrl) {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to musdar social-media platform",
      html: createWelcomeEmailTemplate(name, username, profileUrl),
      category: "Welcome",
    });
    console.log("email send succeessfully", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

export async function sendCmmentNotificationEmail(
  recipientEmail,
  recipientName,
  commenterName,
  contentComment,
  postUrl
) {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "New comment on your post",
      html: createCmmentNotificationEmailTemplate(
        recipientName,
        commenterName,
        contentComment,
        postUrl
      ),
      category: "Comment",
    });
    console.log("email send succeessfully", response);
  } catch (error) {
    throw error;
  }
}

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  const recipient = [{ email: senderEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: "connection_accepted",
    });
    console.log("email send succeessfully", response);
  } catch (error) {
    console.error("Error sending connection accepted email:", error);
  }
};
