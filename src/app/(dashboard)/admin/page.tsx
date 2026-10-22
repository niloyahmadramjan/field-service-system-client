"use client";
import Loading from "@/components/common/loading";
import { useGetAdminDashboard } from "@/hooks/admin.hook";

function page() {
  const { data: adminDashboard, isLoading: isAdminDashboardLoading } =
    useGetAdminDashboard();

  if (isAdminDashboardLoading) {
    return (
      <Loading
        showLogo={false}
        text="Dashboard is loading"
        description="Fetching your dashboard information..."
        className="py-12"
      />
    );
  }

  console.log("admin dashbaord data ", adminDashboard?.data);
  return <div>page</div>;
}

export default page;
