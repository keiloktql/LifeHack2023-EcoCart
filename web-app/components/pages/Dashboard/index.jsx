/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Table from "@/components/shared/Table";
import { useEffect, useState } from "react";
import Button from "@/components/shared/Button";
import LogoSGID from "@/public/assets/img/logo-sgid.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Dashboard = () => {
  const supabaseClient = useSupabaseClient();
  const { auth } = useAuth();
  const userInfo = auth.userInfo;
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [sgidVerified, setSgidVerified] = useState(false);
  const router = useRouter();
  const query = router.asPath;

  const mockTransactions = [
    {
      co_emission: 300,
      merchant: "shopee",
      date: 1685296739,
      transaction_link: "https://flowbite.com/docs/components/tables/"
    },
    {
      co_emission: 450,
      merchant: "lazada",
      date: 1685296739,
      transaction_link: "https://tailwindcss.com/docs/border-width"
    }
  ];

  useEffect(() => {
    if (query.includes("true")) {
      toast.success("Successfully verified with SGID!");
      router.replace("/dashboard", undefined, { shallow: true }); // remove query param from url
    }
    (async () => {
      const { data, error } = await supabaseClient.from("accounts").select();
      if (error || !data.length) {
        toast.error("Something went wrong!");
        console.log("Cannot query accounts");
        return;
      }
      setSgidVerified(data[0].sgid_verified);
    })();
    setTransactions((data) => [
      {
        value: data.co_emission,
        isLink: false
      },
      {
        value: data.co_emission,
        isLink: false
      },
      {
        value: data.co_emission,
        isLink: false
      },
      {
        value: data.transaction_link,
        isLink: true
      }
    ]);
  }, []);

  const tableCol = [
    {
      name: "CO2 Emission"
    },
    {
      name: "Merchant"
    },
    {
      name: "Date"
    },
    {
      name: "View",
      hidden: true
    }
  ];

  return (
    <MainLayout title={"Dashboard | EcoCart"}>
      {sgidVerified ? (
        <div className="max-w-screen-xl flex flex-col m-auto justify-center px-16">
          <div className="mt-10">
            <h1 className="text-display-md font-semibold">
              Welcome back, {userInfo.name}
            </h1>
            <p className="text-md text-gray-600">
              Track and manage your carbon footprint from your shopping
              transactions.
            </p>
            <p className="text-sm text-gray-300">{userInfo.uniqueId}</p>
          </div>
          <div className="flex w-full">
            {mockTransactions ? (
              <Table columns={tableCol} tableRows={mockTransactions} />
            ) : (
              "No data"
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-screen-sm mx-auto text-center">
          <div className="mt-32">
            <h1 className="text-display-md font-semibold">
              Verification Required.
            </h1>
            <p className="text-md text-gray-600">
              To access EcoCart's services, please verify your account via SGID.
            </p>
          </div>

          <Button
            variation="EMPTY"
            customClassName=" mt-8 flex w-full items-center"
            onClickFn={() => router.push(`/api/auth-url?state=${user.id}`)}
          >
            Verify with{" "}
            <Image className="ml-2" src={LogoSGID} width={40} alt="SGID" />
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
