/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import MainLayout from "@/components/layout/MainLayout";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const Dashboard = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return (
    <MainLayout className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-16">
        <div className="mt-20 text-center">
          <h1 className="text-display-lg font-bold">To-do List</h1>
          <p className="text-xl text-gray-600">
            What are your goals for today? Allez!
          </p>
        </div>
        <div className="flex w-full max-w-screen-sm flex-col"></div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
