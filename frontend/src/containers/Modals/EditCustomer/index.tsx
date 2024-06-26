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
import editCustomerSchema from "./schema";

type EditCustomerModalProps = {
  customer: CUSTOMER;
};

type FormValues = {
  name: string;
};

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ customer }) => {
  const { user } = useUser();

  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(editCustomerSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    trigger,
    watch,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    console.log("values", values);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.CUSTOMER}/${customer?.id}`,
        {
          ...values,
          user_id: user?.id,
        }
      );

      toast.success("Customer updated successfully!");

      push(`/customer-location-updater`);
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Error updating customer!");
    }
  };

  const handleClose = () => {
    const pathname = window.location.pathname;

    push(pathname);
  };

  useEffect(() => {
    form.reset({
      name: customer?.name,
    });
  }, [customer]);

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white p-5 rounded-lg w-[700px] text-black flex flex-col gap-10 py-10">
        <header className="flex items-center justify-center w-full">
          <h1 className="text-2xl font-bold w-full">Edit Customer</h1>

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
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="name"
                  placeholder="Customer Name"
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
                Edit customer
              </Button>
            </FormProvider>
          </form>
        </article>
      </div>
    </Modal>
  );
};

export default EditCustomerModal;
