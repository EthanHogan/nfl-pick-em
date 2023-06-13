import {
  SignIn,
  SignInButton,
  SignOutButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "~/components/loading";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.message.hello.useQuery({
    text: "and Welcome to the User Platform!",
  });
  const user = useUser();

  return (
    <>
      <Head>
        <title>User Platform</title>
        <meta
          name="description"
          content="Base platform used to launch future apps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="mb-10 text-4xl font-extrabold text-white">
          {hello.data?.greeting}
        </div>
        <div className="mb-10">
          <CreateMessageWizard />
        </div>
        <Messages />
        <div>
          {!user.isSignedIn && (
            <SignInButton mode="modal">
              <button className="mt-10 cursor-pointer rounded-md border p-2 text-white hover:bg-white hover:text-[#2e026d]">
                Sign In
              </button>
            </SignInButton>
          )}
          {user.isSignedIn && (
            <SignOutButton>
              <button className="mt-10 cursor-pointer rounded-md border p-2 text-white hover:bg-white hover:text-[#2e026d]">
                Sign Out
              </button>
            </SignOutButton>
          )}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};

const Messages = () => {
  const { data: messages } = api.message.getRecentRecords.useQuery({ n: 5 });

  return (
    <div className="flex flex-col gap-3 text-white">
      <h1 className="text-3xl font-bold">Messages from database:</h1>
      {messages?.map((message) => {
        return (
          <div
            key={message.message.id}
            className="flex max-w-xl items-center gap-3 rounded-lg p-3 odd:bg-slate-500 even:bg-slate-700"
            style={{ wordBreak: "break-word" }}
          >
            <Image
              src={message.user.profileImageUrl ?? ""}
              alt="Profile Image"
              className="h-12 w-12 rounded-full"
              width={56}
              height={56}
              priority
            />
            <p>{message.message.text}</p>
          </div>
        );
      })}
    </div>
  );
};

const CreateMessageWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const clerk = useClerk();

  const { mutate, isLoading: isPosting } = api.message.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.message.getRecentRecords.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  return (
    <div className="flex gap-3 text-white">
      {user && (
        <Image
          src={user?.profileImageUrl}
          alt="Profile Image"
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
          priority
        />
      )}
      <input
        placeholder="Add a new message!"
        className="grow rounded-md bg-black bg-opacity-30 p-3 outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      <button
        className="rounded-md border border-white p-3 hover:bg-white hover:text-[#2e026d] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => (user ? mutate({ content: input }) : clerk.openSignIn())}
        disabled={input == ""}
      >
        Add
      </button>
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={25} />
        </div>
      )}
    </div>
  );
};

export default Home;
