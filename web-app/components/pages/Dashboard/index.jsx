/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import MainLayout from "@/components/layout/MainLayout";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Table from "@/components/shared/Table";
import { useEffect, useState } from "react";
import Button from "@/components/shared/Button";
import LogoSGID from "@/public/assets/img/logo-sgid.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import LogoShopee from "@/public/assets/svg/icon-shopee.svg";
import LogoLazada from "@/public/assets/svg/icon-lazada.svg";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
} from "chart.js";
import { chartData, chartLabels, chartOptions } from "./chart";

const Dashboard = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [sgidVerified, setSgidVerified] = useState(false);
  const [totalCO, setTotalCO] = useState(0);
  const [rawChartData, setRawChartData] = useState(() =>
    chartLabels.map(() => 0)
  );
  const router = useRouter();
  const query = router.asPath;

  const loadMerchantImage = (data) => {
    switch (data) {
      case "Shopee": {
        return (
          <p className="flex">
            <Image className="mr-2" src={LogoShopee} width={20} alt="logo" />
            Shopee
          </p>
        );
        break;
      }
      case "Lazada": {
        return (
          <p className="flex">
            <Image className="mr-2" src={LogoLazada} width={20} alt="logo" />
            Lazada
          </p>
        );
        break;
      }
      default: {
        return <p className="flex">{data}</p>;
      }
    }
  };

  useEffect(() => {
    // Success toast for sgid verification
    if (query.includes("true")) {
      toast.success("Successfully verified with SGID!");
      router.replace("/dashboard", undefined, { shallow: true }); // remove query param from url
    }

    (async () => {
      // Check if user is SGID verified
      const { data: dataOne, error: errorOne } = await supabaseClient
        .from("accounts")
        .select();
      if (errorOne || !dataOne.length) {
        toast.error("Something went wrong!");
        console.log("Cannot query accounts");
        return;
      }
      setSgidVerified(dataOne[0].sgid_verified);

      // Retrieve transactions
      const { data: dataTwo, error: errorTwo } = await supabaseClient
        .from("transactions")
        .select()
        .order("created_at", { ascending: false });

      if (!errorTwo) {
        let chartDataArr = chartLabels.map((data) => 0);
        setTransactions(
          dataTwo.map((data) => {
            // Format data for the table
            const formattedDate = dayjs(data.created_at).format(
              "MMM DD, YYYY h:mm A"
            );
            chartLabels.every((month, index) => {
              if (formattedDate.includes(month)) {
                chartDataArr[index] += data.co_emission;
                return false;
              }
              return true;
            });

            return [
              {
                value: (
                  <p>
                    + ${data.co_emission} <sub>kg</sub>
                  </p>
                ),
                isLink: false
              },
              {
                value: loadMerchantImage(data.merchant),
                isLink: false
              },
              {
                value: formattedDate,
                isLink: false
              },
              {
                value: data.transaction_link,
                isLink: true
              }
            ];
          })
        );

        setRawChartData(chartDataArr);
        setTotalCO(chartDataArr.reduce((a, b) => a + b, 0));
      }
      console.log(dataTwo);
    })();
  }, []);

  const tableCol = [
    {
      name: (
        <p>
          CO<sub>2</sub> Emission
        </p>
      )
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

  // Chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend
  );

  return (
    <MainLayout title={"Dashboard | EcoCart"}>
      {sgidVerified ? (
        <div className="max-w-screen-xl flex flex-col m-auto justify-center px-16">
          <div className="mt-5">
            <h1 className="text-display-sm font-semibold">
              Welcome back, {user.user_metadata.name}
            </h1>
            <p className="text-md text-gray-600">
              Track and manage your carbon footprint from your shopping
              transactions.
            </p>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-500">
              Total CO<sub>2</sub> Consumption
            </h2>
            <p></p>
            <h1 className="text-display-sm font-bold text-gray-900">
              {totalCO} <sub>kg</sub>
            </h1>
            <Line
              className="mt-5"
              height={50}
              id="canvas"
              options={chartOptions}
              data={{
                ...chartData,
                datasets: [
                  {
                    ...chartData.datasets[0],
                    data: rawChartData
                  }
                ]
              }}
            />
          </div>
          <hr className="h-px w-full mt-8 bg-gray-300 border-0" />
          <div className="flex flex-col w-full mt-8 mb-16">
            <h1 className="mb-4 font-semibold text-xl">
              Shopping Transactions
            </h1>
            {transactions.length ? (
              <Table columns={tableCol} rows={transactions} />
            ) : (
              "No data."
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
