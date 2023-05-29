import MainLayout from "@/components/layout/MainLayout";
import React from "react";
import Button from "@/components/shared/Button";
import Image from "next/image";
import LogoChromeWhite from "@/public/assets/svg/logo-chrome-white.svg";
import Logo from "@/public/assets/svg/logo.svg";
import { toast } from "react-toastify";

const HomePage = () => {
  return (
    <MainLayout className="flex justify-center override-home">
      <div className="max-w-screen-xl flex flex-col m-auto items-center">
        <Image src={Logo} width={300} alt="Logo" />
        <h1 className="max-w-screen-md mt-8 text-display-xl font-bold text-center">
          Sustainable Shopping Companion Powered by AI
        </h1>
        <p className="text-xl text-gray-600">
          Track and manage your carbon footprint from your shopping transactions
          with the power of AI.
        </p>
        <Button
          onClickFn={() => toast.info("Coming soon...")}
          customClassName="mt-4"
        >
          <Image className="mr-4" src={LogoChromeWhite} alt="CWS" width={20} />{" "}
          Download on Chrome Web Store
        </Button>
      </div>
    </MainLayout>
  );
};

export default HomePage;
