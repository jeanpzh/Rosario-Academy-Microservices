import ForgotPasswordForm from "./components/forgot-password-form";
import { Message } from "@/components/form-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  return (
    <>
      <ForgotPasswordForm />
    </>
  );
}
