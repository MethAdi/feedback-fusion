import { Resend } from "resend";

const resend = new Resend("re_jViNtAcB_2mMD1rqXnjtocu1KwhKDoujW");

resend.emails.send({
  from: "onboarding@resend.dev",
  to: "",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
