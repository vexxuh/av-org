"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Tables";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard: React.FC = () => {
  const router = useRouter();
  return (
    <section className="">
      <div className="max-w-[1900px] w-full mx-auto p-5">
        <article className="flex p-3 bg-white shadow-md rounded-2xl text-sm text-nowrap">
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
                {Array.from({ length: 10 }).map((item, _id) => (
                  <TableRow key={_id} className="cursor-pointer">
                    <TableCell>Avery Dennison</TableCell>
                    <TableCell>Building #22</TableCell>
                    <TableCell>3W1</TableCell>
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
              {Array.from({ length: 10 }).map((item, _id) => (
                <TableRow
                  onClick={() => router.push("/devices")}
                  className=" cursor-pointer"
                  key={_id}
                >
                  <TableCell>Crestron</TableCell>
                  <TableCell>HD-DA2-4KZ-E</TableCell>
                  <TableCell>21568479512</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>1.0.34</TableCell>
                  <TableCell>Root AV Password</TableCell>
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
