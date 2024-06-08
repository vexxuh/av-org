"use client";

import React, { useEffect, useState } from "react";

// Next
import { redirect, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm } from "react-hook-form";

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
import editItemSchema from "./schema";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";
import axios from "axios";
import { Paths } from "@/utils/config/paths";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/FormElements/Form";
import { LOCATION, ROOM } from "@/utils/types/common";
import toast, { Toaster } from "react-hot-toast";

type FormValues = {
  manufacturer: string;
  device_model: string;
  serial_number: string;
  primary_mac: string;
  primary_ip: string;
  secondary_mac: string;
  secondary_ip: string;
  hostname: string;
  firmware: string;
  password: string;
  location: string;
  room: string;
};

const EditContainer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    manufacturer: "",
    device_model: "",
    serial_number: "",
    primary_mac: "",
    primary_ip: "",
    secondary_mac: "",
    secondary_ip: "",
    hostname: "",
    firmware: "",
    password: "",
    location: "",
    room_id: "",
  });
  const [locations, setLocations] = useState<LOCATION[] | []>([]);
  const [rooms, setRooms] = useState<ROOM[] | []>([]);

  const { push } = useRouter();
  const pathname = usePathname();

  const form = useForm<FormValues>({
    resolver: yupResolver(editItemSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
  } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}/${data.id}`,
        {
          ...values,
          customer_id: "26ab8229-b838-4c6b-8c43-aeff57d3c296",
          room_id: values.room,
          location: values.location,
        }
      );

      toast.success("Gear updated successfully!");

      push(`/${response.data.id}`);
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Error updating gear!");
    }
  };
  const handleFetchLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.LOCATION}`
      );

      setLocations(response.data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleFetchRooms = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.ROOM}`
      );

      setRooms(response.data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleFetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}/${
          pathname.split("/")[1]
        }`
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
    handleFetchData();
    handleFetchLocations();
    handleFetchRooms();
  }, []);

  useEffect(() => {
    setValue("manufacturer", data?.manufacturer);
    setValue("device_model", data?.device_model);
    setValue("serial_number", data?.serial_number);
    setValue("primary_mac", data?.primary_mac);
    setValue("primary_ip", data?.primary_ip);
    setValue("secondary_mac", data?.secondary_mac);
    setValue("secondary_ip", data?.secondary_ip);
    setValue("hostname", data?.hostname);
    setValue("firmware", data?.firmware);
    setValue("password", data?.password);
    setValue("location", data?.location);
    setValue("room", data?.room_id);
  }, [data]);

  return (
    <section className="flex items-center justify-center">
      <Toaster />

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

        <h1 className="text-center w-full text-3xl text-semibold">Edit Gear</h1>

        <article className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full max-w-[900px] mx-auto"
          >
            <FormProvider {...form}>
              <div className="grid grid-cols-2 gap-5 ">
                <Input
                  id="manufacturer"
                  label="Manufacturer"
                  placeholder="Manufacturer"
                  error={errors?.manufacturer?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="device_model"
                  label="Device Model"
                  placeholder="Device Model"
                  error={errors?.device_model?.message}
                  required
                  disabled={isSubmitting}
                />

                <Controller
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                          defaultValue={data?.location}
                        >
                          <SelectTrigger
                            className="bg-white h-12 shadow-md rounded-md"
                            id="location"
                          >
                            <SelectValue
                              placeholder={
                                data?.location_name || "Select a location"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {locations.length > 0 &&
                              locations?.map((location) => (
                                <SelectItem
                                  value={location?.id}
                                  className="hover:bg-gray-200 cursor-pointer"
                                  key={location?.id}
                                >
                                  {location?.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.location?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Controller
                  name="room"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                          defaultValue={data?.room_id}
                        >
                          <SelectTrigger
                            className="bg-white h-12 shadow-md rounded-md"
                            id="room"
                          >
                            <SelectValue
                              placeholder={data?.room_name || "Select a room"}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {rooms?.map((room) => (
                              <SelectItem
                                value={room?.id}
                                className="hover:bg-gray-200 cursor-pointer"
                                key={room?.id}
                              >
                                {room?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.room?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Input
                  id="serial_number"
                  label="Serial Number"
                  placeholder="Serial Number"
                  error={errors?.serial_number?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="hostname"
                  label="Hostname"
                  placeholder="Hostname"
                  error={errors?.hostname?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="firmware"
                  label="Firmware"
                  placeholder="Firmware"
                  error={errors?.firmware?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="password"
                  label="Password"
                  placeholder="Password"
                  error={errors?.password?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="primary_mac"
                  label="Primary MAC"
                  placeholder="Primary MAC"
                  error={errors?.primary_mac?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="primary_ip"
                  label="Primary IP"
                  placeholder="Primary IP"
                  error={errors?.primary_ip?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="secondary_mac"
                  label="Secondary MAC"
                  placeholder="Secondary MAC"
                  error={errors?.secondary_mac?.message}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  id="secondary_ip"
                  label="Secondary IP"
                  placeholder="Secondary IP"
                  error={errors?.secondary_ip?.message}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                size="md"
                variant="grey"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Edit Gear
              </Button>
            </FormProvider>
          </form>
        </article>
      </div>
    </section>
  );
};

export default EditContainer;
