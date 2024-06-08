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

// Components
import Modal from "@/components/common/Modal";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";
import {
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/FormElements/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/FormElements/Select";

// Schema
import quickAddSchema from "./schema";

// Utils
import { Paths } from "@/utils/config/paths";
import { LOCATION, ROOM } from "@/utils/types/common";

type QuickAddModalProps = {};

type FormValues = {
  manufacturer: string;
  device_model: string;
  serial_number: string;
  password: string;
  location: string;
  room: string;
};

const QuickAddModal: React.FC<QuickAddModalProps> = () => {
  const [locations, setLocations] = useState<LOCATION[] | []>([]);
  const [rooms, setRooms] = useState<ROOM[] | []>([]);

  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(quickAddSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    console.log("values", values);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.GEAR_ITEM}`,
        {
          ...values,
          customer_id: "26ab8229-b838-4c6b-8c43-aeff57d3c296",
          room_id: values.room,
          location_id: values.location,
          primary_mac: "N/A",
          primary_ip: "N/A",
          secondary_mac: "N/A",
          secondary_ip: "N/A",
          hostname: "N/A",
          firmware: "N/A",
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

  const handleClose = () => {
    const pathname = window.location.pathname;

    push(pathname);
  };

  useEffect(() => {
    handleFetchLocations();
    handleFetchRooms();
  }, []);

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
                  id="password"
                  placeholder="Password"
                  error={errors?.password?.message}
                  required
                  border="border-[1px] border-[#415778]"
                  type="password"
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
    </Modal>
  );
};

export default QuickAddModal;
