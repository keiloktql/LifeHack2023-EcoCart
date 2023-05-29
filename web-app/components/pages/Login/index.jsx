/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-unused-vars */
import Image from "next/image";
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import LogoRaw from "@/public/assets/svg/logo-raw.svg";
import IconGoogle from "@/public/assets/svg/icon-google.svg";
import Button from "@/components/shared/Button";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BASE_URL } from "@/config/constants";

const Login = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [smh, setSmh] = useState(false); // flag to trigger form shaking animation
  const user = useUser();

  const onSubmitFn = async () => {
    setLoading(true);
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${BASE_URL}/dashboard`
      }
    });
    console.log(data);
    if (error) {
      setSmh(true);
      toast.error("An error has occured.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <MainLayout title="Login | EcoCart">
      <div className="smh-container w-full">
        <div
          className={`smh-card${
            smh ? "--animate" : ""
          } mx-auto my-36 flex h-full max-w-[360px] flex-col items-center`}
          onAnimationEnd={() => setSmh(false)}
        >
          <Image src={LogoRaw} width={50} alt="logo" />
          <h1 className="mt-4 text-display-sm font-semibold text-gray-900">
            Log In
          </h1>
          <p className="text-gray-600">Welcome back!</p>
          <hr className="h-px w-full mt-8 bg-gray-300 border-0" />
          <Button
            variation="EMPTY"
            customClassName="mt-8 flex w-full items-center"
            onClickFn={onSubmitFn}
            loading={loading}
            disabled={loading}
          >
            <Image className="mr-4" src={IconGoogle} width={20} alt="Google" />
            Login with Google{" "}
          </Button>
          <p className="mt-8 text-sm text-gray-400 text-center">
            If you do not have an EcoCart account yet, it will automatically be
            created once you sign in.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
export default Login;
