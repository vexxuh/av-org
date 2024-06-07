// Components
import Layout from "@/components/common/Layout";

// Containers
import ItemDetailContainer from "@/containers/ItemDetail";

const EditPage = () => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        <ItemDetailContainer />
      </Layout>
    </main>
  );
};

export default EditPage;
