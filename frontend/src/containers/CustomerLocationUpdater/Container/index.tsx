"use client";

import React, { useEffect, useState } from "react";

// Next
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Clerk
import { useUser } from "@clerk/nextjs";

// axios
import axios from "axios";

// React Hot Toast
import toast, { Toaster } from "react-hot-toast";

// React Loading Skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Components
import Hierarchy, { Node } from "@/components/common/Hierarchy";
import AddCustomerModal from "@/containers/Modals/AddCustomer";
import AddLocationModal from "@/containers/Modals/AddLocation";
import AddRoomModal from "@/containers/Modals/AddRoom";
import Button from "@/components/common/Button";

// Utils
import { Paths } from "@/utils/config/paths";

const CLUpdaterContainer: React.FC = () => {
  const [data, setData] = useState<Node[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);

  const searchParams = useSearchParams();

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
    setInitialLoad(true);
  };

  useEffect(() => {
    if (user || !searchParams.get("modal")) handleFetchData();
  }, [user, searchParams]);

  return (
    <section className="w-full mx-auto flex items-center justify-center py-10">
      <Toaster />
      <article className="flex flex-col gap-10 w-full">
        <h1 className="text-center text-3xl text-semibold">
          Manage Customers and Locations
        </h1>

        <article className="flex items-center gap-5 justify-center max-w-3xl w-full mx-auto flex-col md:flex-row">
          <Link
            href={"/customer-location-updater?modal=add-customer"}
            className="w-full"
          >
            <Button size="md" variant="grey">
              Add Customer
            </Button>
          </Link>
          <Link
            href={"/customer-location-updater?modal=add-location"}
            className="w-full"
          >
            <Button variant="black" size="md">
              Add Location
            </Button>
          </Link>

          <Link
            href={"/customer-location-updater?modal=add-room"}
            className="w-full"
          >
            <Button variant="green" size="md">
              Add Room
            </Button>
          </Link>
        </article>

        {isLoading && !initialLoad ? (
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-10">
            {[1, 2].map((item) => (
              <div className="bg-gray-300 py-5 px-3 rounded-md" key={item}>
                <Skeleton height={50} width={`60%`} />
                <Skeleton height={30} count={5} />
              </div>
            ))}
          </div>
        ) : data?.length > 0 ? (
          <div className="w-full max-w-3xl mx-auto">
            <Hierarchy data={data} setData={setData} />
          </div>
        ) : (
          <p className="text-center">No data found</p>
        )}
      </article>

      {searchParams.get("modal") === "add-customer" && <AddCustomerModal />}
      {searchParams.get("modal") === "add-location" && <AddLocationModal />}
      {searchParams.get("modal") === "add-room" && <AddRoomModal />}
    </section>
  );
};

export default CLUpdaterContainer;
