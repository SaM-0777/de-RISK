import Navbar from "@/components/common/navbar";
import UserActivities from "@/components/user-activities";
import UserDetails from "@/components/user-details";
import UserPolicies from "@/components/user-policies";
import React from "react";

export default function DashboardPage() {
  return (
    <main className="">
      <Navbar />
      <div className="p-8" >
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <UserDetails />
        <UserPolicies />
        <UserActivities />
      </div>
    </main>
  );
}
