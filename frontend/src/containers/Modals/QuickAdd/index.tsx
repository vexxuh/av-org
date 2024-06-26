import React, { useEffect, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Axios
import axios from "axios";

// React Hot Toast
import toast from "react-hot-toast";

// React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

// React Icons
import { IoMdClose } from "react-icons/io";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

// Components
import Modal from "@/components/common/Modal";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/FormElements/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/FormElements/Select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/Popover";

// Schema
import quickAddSchema from "./schema";

// Utils
import { Paths } from "@/utils/config/paths";
import { CUSTOMER, LOCATION, ROOM } from "@/utils/types/common";
import { cn } from "@/utils/functions/cn";
import { useUser } from "@clerk/nextjs";
import AddTags from "@/components/common/AddTags";

type QuickAddModalProps = {};

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

const QuickAddModal: React.FC<QuickAddModalProps> = () => {
  const [locations, setLocations] = useState<LOCATION[] | []>([]);
  const [rooms, setRooms] = useState<ROOM[] | []>([]);
  const [customers, setCustomers] = useState<CUSTOMER[] | []>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>("");

  const { user } = useUser();

  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(quickAddSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    trigger,
    watch,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}`,
        {
          gear_item: {
            ...values,
            customer_id: values.customer,
            room_id: values.room,
            location_id: values.location,
            user_id: user?.id,
          },
          tags: tags?.map((tag) => ({ name: tag, user_id: user?.id })),
        }
      );

      toast.success("Gear added successfully!");

      push(`/${response.data.id}`);
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Error adding gear!");
    }
  };

  const handleFetchLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${
          Paths.LOCATION
        }?customer_id=${getValues("customer")}`
      );

      setLocations(response.data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleFetchRooms = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${
          Paths.ROOM
        }?location_id=${getValues("location")}`
      );

      setRooms(response.data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleClose = () => {
    const pathname = window.location.pathname;

    push(pathname);
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

  const handleAddTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const inputValue = (e.target as HTMLInputElement).value.trim();

      if (inputValue === "") return;

      if (tags.length >= 30) return;
      if (tags.includes(inputValue)) return;

      setTags((prev) => [...prev, inputValue]);
      setTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((s) => s !== tag));
  };

  useEffect(() => {
    handleFetchCustomers();
  }, []);

  const selectedCustomer = watch("customer");
  useEffect(() => {
    if (selectedCustomer) {
      handleFetchLocations();
    }
  }, [watch("customer")]);

  const selectedLocation = watch("location");
  useEffect(() => {
    if (selectedLocation) {
      handleFetchRooms();
    }
  }, [selectedLocation]);

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white p-5 rounded-lg w-[700px] text-black flex flex-col gap-10 py-10">
        <header className="flex items-center justify-center w-full">
          <h1 className="text-2xl font-bold w-full">Quick Add</h1>

          <span
            className="flex justify-end w-1/2 cursor-pointer"
            onClick={handleClose}
          >
            <IoMdClose fontSize={26} />
          </span>
        </header>

        <article className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mx-auto"
          >
            <FormProvider {...form}>
              <div className="flex gap-3">
                <Input
                  id="manufacturer"
                  placeholder="Manufacturer"
                  error={errors?.manufacturer?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />

                <Input
                  id="device_model"
                  placeholder="Device Model"
                  error={errors?.device_model?.message}
                  required
                  disabled={isSubmitting}
                  border="border-[1px] border-[#415778]"
                />
              </div>

              <FormField
                name="customer"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex h-12 w-full items-center justify-between cursor-pointer rounded-md shadow-md border  border-[#415778] bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {field.value
                            ? customers.find(
                                (customer) => customer.id === field.value
                              )?.name
                            : "Select Customer"}
                          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="min-w-[660px] w-full p-0 z-[1000]">
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

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            className="bg-white h-12 shadow-md rounded-md border-[1px] border-[#415778]"
                            id="location"
                          >
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-[1000]">
                            {locations?.length > 0 ? (
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
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            className="bg-white h-12 shadow-md rounded-md border-[1px] border-[#415778]"
                            id="room"
                          >
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-[1000]">
                            {rooms?.length > 0 ? (
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

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="serial_number"
                  placeholder="Serial Number"
                  error={errors?.serial_number?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />

                <Input
                  id="hostname"
                  placeholder="Hostname"
                  error={errors?.hostname?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="firmware"
                  placeholder="Firmware"
                  error={errors?.firmware?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />

                <Input
                  id="password"
                  placeholder="Password"
                  error={errors?.password?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  type="password"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="primary_mac"
                  placeholder="Primary MAC"
                  error={errors?.primary_mac?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />

                <Input
                  id="primary_ip"
                  placeholder="Primary IP"
                  error={errors?.primary_ip?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="secondary_mac"
                  placeholder="Secondary MAC"
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />

                <Input
                  id="secondary_ip"
                  placeholder="Secondary IP"
                  error={errors?.secondary_ip?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  disabled={isSubmitting}
                />
              </div>

              <AddTags
                handleAddTags={handleAddTags}
                handleRemoveTag={handleRemoveTag}
                tags={tags}
                tag={tag}
                setTag={setTag}
                isQuickAdd={true}
              />

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
    </Modal>
  );
};

export default QuickAddModal;
