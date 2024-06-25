import React, { useEffect, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Axios
import axios from "axios";

// React Hot Toast
import toast from "react-hot-toast";

// Clerk
import { useUser } from "@clerk/nextjs";

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
import AddTags from "@/components/common/AddTags";

// Schema
import quickAddSchema from "./schema";

// Utils
import { Paths } from "@/utils/config/paths";
import { CUSTOMER, LOCATION, ROOM } from "@/utils/types/common";
import { cn } from "@/utils/functions/cn";
import addLocationSchema from "./schema";

type AddLocationModalProps = {};

type FormValues = {
  name: string;
  customer: string;
};

const AddLocationModal: React.FC<AddLocationModalProps> = () => {
  const [customers, setCustomers] = useState<CUSTOMER[] | []>([]);

  const { user } = useUser();

  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(addLocationSchema),
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.LOCATION}`,
        {
          ...values,
          user_id: user?.id,
          customer_id: values.customer,
        }
      );

      toast.success("Location added successfully!");

      push(`/customer-location-updater`);
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Error adding location!");
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

  useEffect(() => {
    handleFetchCustomers();
  }, []);

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white p-5 rounded-lg w-[700px] text-black flex flex-col gap-10 py-10">
        <header className="flex items-center justify-center w-full">
          <h1 className="text-2xl font-bold w-full">Add Location</h1>

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

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="name"
                  placeholder="Location Name"
                  error={errors?.name?.message}
                  required
                  border="border-[1px] border-[#415778]"
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
                Add Location
              </Button>
            </FormProvider>
          </form>
        </article>
      </div>
    </Modal>
  );
};

export default AddLocationModal;
