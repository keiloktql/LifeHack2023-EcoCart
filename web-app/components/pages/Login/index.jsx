/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-unused-vars */
import Image from "next/image";
import React, { useState } from "react";
import * as Yup from "yup";
import MainLayout from "@/components/layout/MainLayout";
import LogoRaw from "@/public/assets/svg/logo-raw.svg";
import LogoSGID from "@/public/assets/img/logo-sgid.png";
import Button from "@/components/shared/Button";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid format.").required("Required field."),
    password: Yup.string().required("Required field.")
  });
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [smh, setSmh] = useState(false); // flag to trigger form shaking animation
  const { auth, setAuth } = useAuth();
  const user = useUser();

  const onSubmitFn = async ({ email, password }) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
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
            onClickFn={() => router.push(`/api/auth-url`)}
          >
            Login with{" "}
            <Image className="ml-2" src={LogoSGID} width={40} alt="SGID" />
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
