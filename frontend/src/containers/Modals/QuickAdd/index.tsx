import React from "react";

// Next
import { useRouter } from "next/navigation";

// React Hook Form
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

// Components
import Modal from "@/components/common/Modal";
import { IoMdClose } from "react-icons/io";
import Input from "@/components/FormElements/Input/UncontrolledInput";
import Button from "@/components/common/Button";

// Schema
import quickAddSchema from "./schema";

type QuickAddModalProps = {};

type FormValues = {
  manufacturer: string;
  deviceModel: string;
  serialNumber: string;
  primaryMAC: string;
};

const QuickAddModal: React.FC<QuickAddModalProps> = () => {
  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(quickAddSchema),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = async (values: FormValues) => {
    console.log("values", values);
  };

  const handleClose = () => {
    const pathname = window.location.pathname;

    push(pathname);
  };

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white p-5 rounded-lg w-[700px] text-black flex flex-col gap-10 py-10">
        <header className="flex items-center justify-center">
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
            className="flex flex-col gap-5 w-full  mx-auto"
          >
            <FormProvider {...form}>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="manufacturer"
                  placeholder="Manufacturer"
                  error={errors?.manufacturer?.message}
                  required
                />

                <Input
                  id="deviceModel"
                  placeholder="Device Model"
                  error={errors?.deviceModel?.message}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  id="serialNumber"
                  placeholder="Serial Number"
                  error={errors?.serialNumber?.message}
                  required
                />

                <Input
                  id="primaryMAC"
                  placeholder="Primary MAC"
                  error={errors?.primaryMAC?.message}
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
    </Modal>
  );
};

export default QuickAddModal;
