"use client";

import React, { useEffect, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Axios
import axios from "axios";

// Skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// React Hot Toast
import { Toaster } from "react-hot-toast";

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Tables";
import DashboardHeader from "./Header";
import TablePagination from "./Pagination";

// Utils
import { Paths } from "@/utils/config/paths";
import { exportTable } from "@/utils/functions/exportTable";
import DashboardFilters from "./Filters";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any>([]);
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageString, setPageString] = useState("0-0 of 0" as string);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const handleFetchItems = async (search: string = "") => {
    setLoading(true);

    const validFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key]) {
        acc[key] = filters[key];
      }
      return acc;
    }, {} as Record<string, string>);

    const filterString = Object.keys(validFilters)
      .map((key) => `${key}=${validFilters[key]}`)
      .join("&");

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}?limit=${limit}&page=${currentPage}&search=${search}&${filterString}`
      );

      setData(data?.gear_items);
      setTotalPages(data?.total_pages);
      setCurrentPage(data?.current_page);

      setPageString(
        `${(currentPage - 1) * limit + 1}-${
          currentPage * limit > data?.total_items
            ? data?.total_items
            : currentPage * limit
        } of ${data?.total_items}`
      );
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleFetchItems();
  }, [limit, currentPage, filters]);

  const handleExportTable = async (type: string) => {
    const updatedDataWithHeader = [
      [
        "Customer",
        "Location",
        "Room",
        "Manufacturer",
        "Device Model",
        "Serial Number",
        "Primary MAC",
        "Primary IP",
        "Secondary MAC",
        "Secondary IP",
        "Hostname",
        "Firmware",
        "Password",
      ],
      ...data.map((item: any) => [
        item?.customer_name,
        item?.location_name,
        item?.room_name,
        item?.manufacturer,
        item?.device_model,
        item?.serial_number,
        item?.primary_mac,
        item?.primary_ip,
        item?.secondary_mac,
        item?.secondary_ip,
        item?.hostname,
        item?.firmware,
        item?.password,
      ]),
    ];

    exportTable(
      updatedDataWithHeader,
      `AV Gear-${new Date().toISOString().slice(0, 10)}`,
      type
    );
  };

  const handleChangePagee = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
    </TableRow>
  );

  return (
    <section className="w-screen">
      <Toaster />

      <div className="max-w-[1900px] w-full mx-auto p-5">
        <DashboardFilters submitFilters={setFilters} isLoading={loading} />

        <DashboardHeader
          limit={limit}
          handleUpdateLimit={(limit: number) => setLimit(limit)}
          handleExportTable={handleExportTable}
          handleFetchItems={handleFetchItems}
        />

        <article className="flex p-3 bg-white shadow-md rounded-lg text-sm text-nowrap">
          <div className="w-1/4">
            <Table className="border-r-[2px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: limit }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data.length > 0 ? (
                  data?.map((item: any) => (
                    <TableRow key={item?.id} className=" odd:bg-gray-100">
                      <TableCell>{item?.customer_name}</TableCell>
                      <TableCell>{item?.location_name}</TableCell>
                      <TableCell>{item?.room_name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Device Model</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Primary MAC</TableHead>
                <TableHead>Primary IP</TableHead>
                <TableHead>Secondary MAC</TableHead>
                <TableHead>Secondary IP</TableHead>
                <TableHead>Hostname</TableHead>
                <TableHead>Firmware</TableHead>
                <TableHead>Password</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: limit }).map((_, index) =>
                  renderSkeleton()
                )
              ) : data.length > 0 ? (
                data?.map((item: any) => (
                  <TableRow
                    onClick={() => router.push(`/${item?.id}`)}
                    className="cursor-pointer odd:bg-gray-100 hover:bg-gray-200 transition-all ease-in-out duration-200"
                    key={item?.id}
                  >
                    <TableCell>{item?.manufacturer}</TableCell>
                    <TableCell>{item?.device_model}</TableCell>
                    <TableCell>{item?.serial_number}</TableCell>
                    <TableCell>{item?.primary_mac}</TableCell>
                    <TableCell>{item?.primary_ip}</TableCell>
                    <TableCell>{item?.secondary_mac}</TableCell>
                    <TableCell>{item?.secondary_ip}</TableCell>
                    <TableCell>{item?.hostname}</TableCell>
                    <TableCell>{item?.firmware}</TableCell>
                    <TableCell>{item?.password}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </article>
        <TablePagination
          currentPage={currentPage}
          changePage={handleChangePagee}
          totalPages={totalPages}
          pageString={pageString}
        />
      </div>
    </section>
  );
};

export default Dashboard;
