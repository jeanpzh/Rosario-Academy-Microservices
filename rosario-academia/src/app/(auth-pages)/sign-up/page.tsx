import { FormMessage, Message } from "@/components/form-message";
import SignUpForm from "@/app/(auth-pages)/components/SignUpForm";

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen  w-full flex-col items-center ">
        <SignUpForm message={searchParams} />
      </div>
    </>
  );
}
