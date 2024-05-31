"use client";

import React from "react";

// Next
import { useRouter } from "next/navigation";
import Link from "next/link";

// React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

// Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/common/Breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/FormElements/Select";

// Schema
import detailedAddSchema from "./schema";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";

type FormValues = {
  manufacturer: string;
  deviceModel: string;
  serialNumber: string;
  primaryMAC: string;
  primaryIP: string;
  secondaryMAC: string;
  secondaryIP: string;
  hostname: string;
  firmware: string;
  password: string;
  location: string;
  room: string;
};

const DetailedAddContainer: React.FC = () => {
  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(detailedAddSchema),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = async (values: FormValues) => {
    console.log("values", values);
  };

  return (
    <section className="flex items-center justify-center">
      <div className="max-w-[1900px] w-full mx-auto flex items-center flex-col justify-between px-5 py-7 gap-10">
        {/* <Breadcrumb className="md:w-full ml-5 print:hidden m-auto">
          <BreadcrumbList className="text-gray-400 ">
            <BreadcrumbItem className="hover:text-gray-700 transition-colors duration-200 cursor-pointer">
              <Link href="/">
                <BreadcrumbPage>Home</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="transition-colors duration-200">
              <BreadcrumbPage>Detailed Add</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        <h1 className="text-center w-full text-3xl text-semibold">Add Gear</h1>

        <article className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full max-w-[900px] mx-auto"
          >
            <FormProvider {...form}>
              <div className="grid grid-cols-2 items-center gap-5 ">
                <Input
                  id="manufacturer"
                  label="Manufacturer"
                  placeholder="Manufacturer"
                  error={errors?.manufacturer?.message}
                  required
                />

                <Input
                  id="deviceModel"
                  label="Device Model"
                  placeholder="Device Model"
                  error={errors?.deviceModel?.message}
                  required
                />

                <div>
                  <label htmlFor="location">Location</label>
                  <Select>
                    <SelectTrigger
                      className="bg-white h-12 shadow-md rounded-md"
                      id="location"
                    >
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        value="NYC"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        New York
                      </SelectItem>
                      <SelectItem
                        value="California"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        California
                      </SelectItem>
                      <SelectItem
                        value="WC"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        Washington DC
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {errors?.location?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors?.location?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="room">Room</label>
                  <Select>
                    <SelectTrigger
                      className="bg-white h-12 shadow-md rounded-md"
                      id="room"
                    >
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        value="3W1"
                        defaultValue="3w1"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        3W1
                      </SelectItem>
                      <SelectItem
                        value="3W2"
                        defaultValue="3W2"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        3W2
                      </SelectItem>
                      <SelectItem
                        value="W14"
                        defaultValue="3w1"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        W14
                      </SelectItem>
                      <SelectItem
                        value="W141"
                        defaultValue="3w1"
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        W141
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.room?.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors?.room?.message}
                    </p>
                  )}
                </div>

                <Input
                  id="serialNumber"
                  label="Serial Number"
                  placeholder="Serial Number"
                  error={errors?.serialNumber?.message}
                  required
                />

                <Input
                  id="hostname"
                  label="Hostname"
                  placeholder="Hostname"
                  error={errors?.hostname?.message}
                  required
                />

                <Input
                  id="firmware"
                  label="Firmware"
                  placeholder="Firmware"
                  error={errors?.firmware?.message}
                  required
                />

                <Input
                  id="password"
                  label="Password"
                  placeholder="Password"
                  error={errors?.password?.message}
                  required
                />

                <Input
                  id="primaryMAC"
                  label="Primary MAC"
                  placeholder="Primary MAC"
                  error={errors?.primaryMAC?.message}
                  required
                />

                <Input
                  id="primaryIP"
                  label="Primary IP"
                  placeholder="Primary IP"
                  error={errors?.primaryIP?.message}
                  required
                />

                <Input
                  id="secondaryMAC"
                  label="Secondary MAC"
                  placeholder="Secondary MAC"
                  error={errors?.secondaryMAC?.message}
                  required
                />

                <Input
                  id="secondaryIP"
                  label="Secondary IP"
                  placeholder="Secondary IP"
                  error={errors?.secondaryIP?.message}
                  required
                />
              </div>

              <Button type="submit" size="md" variant="grey-transparent">
                Add Gear
              </Button>
            </FormProvider>
          </form>
        </article>
      </div>
    </section>
  );
};

export default DetailedAddContainer;
