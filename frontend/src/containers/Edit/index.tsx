"use client";

import React, { useEffect } from "react";

// Next
import { redirect, useRouter } from "next/navigation";
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

// Schema
import editItemSchema from "./schema";
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
};

const EditContainer: React.FC = () => {
  const { push } = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(editItemSchema),
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = async (values: FormValues) => {
    console.log("values", values);

    push("/devices");
  };

  useEffect(() => {
    form.reset({
      manufacturer: "Apple",
      deviceModel: "iPhone 12",
      serialNumber: "123456789",
      primaryMAC: "12:34:56:78:90",
      primaryIP: "",
      secondaryMAC: "12:34:56:78:90",
      secondaryIP: "",
      hostname: "iPhone",
      firmware: "iOS 14",
      password: "password",
    });
  }, []);

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

        <h1 className="text-center w-full text-3xl text-semibold">Edit Gear</h1>

        <article className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full max-w-[500px]  mx-auto"
          >
            <FormProvider {...form}>
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

              <Input
                id="serialNumber"
                label="Serial Number"
                placeholder="Serial Number"
                error={errors?.serialNumber?.message}
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

              <Button type="submit" size="md" variant="grey-transparent">
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
