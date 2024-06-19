"use client";

import React, { useState, useEffect } from "react";

// Next
import { useRouter } from "next/navigation";
import Link from "next/link";

// Axios
import axios from "axios";

// React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

// React Hot Toast
import toast, { Toaster } from "react-hot-toast";

// React Icons
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/FormElements/Form";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/Command";
import CollapsibleEdit from "../CollapsibleEdit";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/Popover";

// Schema
import detailedAddSchema from "./schema";

// Utils
import { Paths } from "@/utils/config/paths";
import { CUSTOMER, LOCATION, ROOM } from "@/utils/types/common";
import { cn } from "@/utils/functions/cn";

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
  customer: string;
};

const DetailedAddContainer: React.FC = () => {
  const [locations, setLocations] = useState<LOCATION[] | []>([]);
  const [rooms, setRooms] = useState<ROOM[] | []>([]);
  const [customers, setCustomers] = useState<CUSTOMER[] | []>([]);
  const [addedGear, setAddedGear] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: yupResolver(detailedAddSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    trigger,
    getValues,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}`,
        {
          ...values,
          customer_id: values.customer,
          room_id: values.room,
          location_id: values.location,
        }
      );

      toast.success("Gear added successfully!");

      setAddedGear([...addedGear, data.id]);
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Error adding gear!");
    }
  };

  const handleFetchLocations = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${
          Paths.LOCATION
        }?customer_id=${getValues("customer")}`
      );

      setLocations(data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleFetchRooms = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.ROOM}`
      );

      setRooms(data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleFetchCustomers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.CUSTOMER}`
      );

      setCustomers(data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  useEffect(() => {
    handleFetchCustomers();
  }, []);

  useEffect(() => {
    if (getValues("customer")) handleFetchLocations();
  }, [getValues("customer")]);

  useEffect(() => {
    if (getValues("location")) handleFetchRooms();
  }, [getValues("location")]);

  return (
    <section className="flex items-center justify-center">
      <Toaster />
      <div className="max-w-[1900px] w-full mx-auto flex items-center flex-col justify-between px-5 py-7 gap-10">
        {addedGear.length > 0 && (
          <article className="max-w-[900px] w-full flex flex-col gap-4">
            {addedGear.map((gear) => (
              <CollapsibleEdit key={gear} id={gear} />
            ))}
          </article>
        )}

        <h1 className="text-center w-full text-3xl text-semibold">Add Gear</h1>

        <article className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full max-w-[900px] mx-auto"
          >
            <FormProvider {...form}>
              <div className="grid grid-cols-2 gap-5 w-full">
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
              </div>

              <FormField
                name="customer"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Customer</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex h-12 w-full items-center justify-between cursor-pointer rounded-md shadow-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {field.value
                            ? customers.find(
                                (customer) => customer.id === field.value
                              )?.name
                            : "Select Customer"}
                          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="min-w-full md:min-w-[900px] w-full p-0">
                        <FormControl>
                          <Command>
                            <CommandInput placeholder="Search Customers..." />
                            <CommandList>
                              <CommandEmpty>No customer found.</CommandEmpty>
                              <CommandGroup>
                                {customers.map((customer) => (
                                  <CommandItem
                                    value={customer.name}
                                    key={customer.id}
                                    onSelect={() => {
                                      form.setValue("customer", customer.id);
                                      trigger("customer");
                                    }}
                                  >
                                    <LuCheck
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        customer.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {customer.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </FormControl>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-5 w-full">
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
                        >
                          <SelectTrigger
                            className="bg-white h-12 shadow-md rounded-md"
                            id="location"
                          >
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {locations.length > 0 ? (
                              locations?.map((location) => (
                                <SelectItem
                                  value={location?.id}
                                  className="hover:bg-gray-200 cursor-pointer"
                                  key={location?.id}
                                >
                                  {location?.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="text-center">
                                {getValues("customer")
                                  ? "No locations found."
                                  : "Select a customer first."}
                              </div>
                            )}
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
                        >
                          <SelectTrigger
                            className="bg-white h-12 shadow-md rounded-md"
                            id="room"
                          >
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {rooms.length > 0 ? (
                              rooms?.map((room) => (
                                <SelectItem
                                  value={room?.id}
                                  className="hover:bg-gray-200 cursor-pointer"
                                  key={room?.id}
                                >
                                  {room?.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="text-center">
                                {getValues("location")
                                  ? "No rooms found."
                                  : "Select a room first."}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.room?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-5 w-full">
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
                  disabled={isSubmitting}
                  required
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
