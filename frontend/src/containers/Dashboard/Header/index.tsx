import Button from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/FormElements/DropdownMenu";
import Input from "@/components/FormElements/Input/ControlledInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/FormElements/Select";

import React from "react";
import { BsFiletypeCsv, BsFiletypeXlsx } from "react-icons/bs";
import { CiExport } from "react-icons/ci";
import { HiOutlineSearch } from "react-icons/hi";

const DashboardHeader: React.FC = () => {
  const handleExportTable = async (type: string) => {};

  return (
    <div className="p-3 w-full justify-between md:flex bg-white">
      <div className="flex items-center w-full mb-4 md:mb-0">
        <div className="w-full md:w-auto">
          <Select defaultValue="25" value="25">
            <SelectContent className="bg-slate-800">
              <SelectGroup>
                <SelectLabel>{"NbPerPage"}</SelectLabel>

                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex w-full md:w-auto">
        <Input
          className="w-40 md:w-auto mr-2 m-auto h-10"
          placeholder={"Search"}
          // value={taskSearch}
          // onChange={(e) => setTaskSearch(e.target.value)}
          id="search"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-md border bg-slate-800 text-popover-foreground shadow-md  hover:bg-slate-900 flex gap-2"
              iconStart={<CiExport fontSize={16} />}
            >
              Export
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => handleExportTable("csv")}
            >
              <BsFiletypeCsv className=" h-4 w-4" />

              <span>CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => handleExportTable("xlsx")}
            >
              <BsFiletypeXlsx className=" h-4 w-4" />

              <span>XLSX</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
