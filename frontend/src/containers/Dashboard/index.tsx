"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Tables";
import { Paths } from "@/utils/config/paths";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./Header";
import { exportTable } from "@/utils/functions/exportTable";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any>([]);
  const [limit, setLimit] = useState(25);

  const handleFetchItems = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}?limit=${limit}`
      );

      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchItems();
  }, [limit]);

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

  return (
    <section className="">
      <div className="max-w-[1900px] w-full mx-auto p-5">
        <DashboardHeader
          limit={limit}
          handleUpdateLimit={(limit: number) => setLimit(limit)}
          handleExportTable={handleExportTable}
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
                {data?.map((item: any) => (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.customer_name}</TableCell>
                    <TableCell>{item?.location_name}</TableCell>
                    <TableCell>{item?.room_name}</TableCell>
                  </TableRow>
                ))}
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
              {data?.map((item: any) => (
                <TableRow
                  onClick={() => router.push(`/${item?.id}`)}
                  className=" cursor-pointer"
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
              ))}
            </TableBody>
          </Table>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
