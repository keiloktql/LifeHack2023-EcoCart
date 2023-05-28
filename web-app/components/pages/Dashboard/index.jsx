/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Table from "@/components/shared/Table";
import { useEffect, useState } from "react";
import { Link } from "next";

const Dashboard = () => {
  const supabaseClient = useSupabaseClient();
  const { auth } = useAuth();
  const userInfo = auth.userInfo;
  const [transactions, setTransactions] = useState([]);

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
    </MainLayout>
  );
};

export default Dashboard;
