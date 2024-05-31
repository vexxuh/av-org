import { Metadata } from "next";

// Components
import Layout from "@/components/common/Layout";

// Containers
import Dashboard from "@/containers/Dashboard";

export const metadata: Metadata = {
  title: "AV Gear",
  description: "Inventory-like System",
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout navListingOptions={true}>
        <Dashboard />
      </Layout>
    </main>
  );
}
