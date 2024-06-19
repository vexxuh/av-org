"use client";

// Components
import Layout from "@/components/common/Layout";

// Containers
import EditContainer from "@/containers/Edit";
import { usePathname } from "next/navigation";

const EditPage = () => {
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        <EditContainer pathId={pathname.split("/")[1]} />
      </Layout>
    </main>
  );
};

export default EditPage;
