"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Components
import Layout from "@/components/common/Layout";

// Containers
import ItemDetailContainer from "@/containers/ItemDetail";
import PageLoader from "@/components/common/PageLoader";

// Utils
import { Paths } from "@/utils/config/paths";

const EditPage = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<any>(null);

  const { push } = useRouter();

  const editPageData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}/${params?.id}`
      );

      if (!data?.id) {
        return push("/");
      }

      setData(data);
    } catch (error) {
      console.error(error);
      push("/");
    }
  };

  useEffect(() => {
    editPageData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-gray-200">
      <Layout>
        {!data ? <PageLoader /> : <ItemDetailContainer data={data} />}
      </Layout>
    </main>
  );
};

export default EditPage;
