// Components
import Layout from "@/components/common/Layout";

// Containers
import EditContainer from "@/containers/Edit";

const EditPage = () => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        <EditContainer />
      </Layout>
    </main>
  );
};

export default EditPage;
