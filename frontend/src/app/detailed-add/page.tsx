// Components
import Layout from "@/components/common/Layout";

// Containers
import DetailedAddContainer from "@/containers/DetailedAdd";

const DetailedAddPage = () => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        <DetailedAddContainer />
      </Layout>
    </main>
  );
};

export default DetailedAddPage;
