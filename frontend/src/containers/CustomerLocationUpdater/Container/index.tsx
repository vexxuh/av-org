import Hierarchy, { Node } from "@/components/common/Hierarchy";
import { Paths } from "@/utils/config/paths";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const CLUpdaterContainer: React.FC = () => {
  const [data, setData] = useState<Node[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.CUSTOMER}/${user?.id}/locations`
      );

      setData(data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) handleFetchData();
  }, [user]);

  return (
    <section className="w-full mx-auto flex items-center justify-center py-10">
      <Toaster />
      <article className="flex flex-col gap-10 w-full">
        <h1 className="text-center text-3xl text-semibold">
          Manage Customers and Locations
        </h1>

        {isLoading ? (
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
            {[1, 2].map((item) => (
              <div className="bg-gray-300 py-5 px-3 rounded-md" key={item}>
                <Skeleton height={50} width={`60%`} />
                <Skeleton height={30} count={5} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            <Hierarchy data={data} setData={setData} />
          </div>
        )}
      </article>
    </section>
  );
};

export default CLUpdaterContainer;
