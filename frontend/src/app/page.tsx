// Components
import Layout from "@/components/common/Layout";

// Containers
import Dashboard from "@/containers/Dashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        <Dashboard />
      </Layout>
    </main>
  );
}
