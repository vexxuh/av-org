import React from "react";

// React Icons
import { BsFiletypeCsv, BsFiletypeXlsx } from "react-icons/bs";
import { CiExport } from "react-icons/ci";

// Components
import Button from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/FormElements/DropdownMenu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/FormElements/Select";

type DashboardHeaderProps = {
  limit: number;
  handleUpdateLimit: (limit: number) => void;
  handleExportTable: (type: string) => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  limit,
  handleUpdateLimit,
  handleExportTable,
}) => {
  return (
    <div className="p-3 w-full justify-between md:flex bg-white mb-4 rounded-lg">
      <div className="flex items-center w-full">
        <div className=" md:w-auto">
          <Select
            defaultValue={limit.toString()}
            value={limit.toString()}
            onValueChange={(value) => handleUpdateLimit(parseInt(value))}
          >
            <SelectTrigger
              className="bg-[#415778] w-32 h-12 shadow-md rounded-md text-white"
              id="location"
            >
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {[5, 10, 25, 50, 100, 500, 1000].map((item) => (
                <SelectItem
                  value={item.toString()}
                  className="hover:bg-gray-200 cursor-pointer"
                  key={item}
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex w-full md:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <Button
                className="rounded-md border text-popover-foreground shadow-md  flex gap-2"
                iconStart={<CiExport fontSize={16} />}
                variant="grey"
                size="sm"
              >
                Export
              </Button>
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-white flex gap-1 flex-col">
            <DropdownMenuItem
              className="hover:bg-gray-300 cursor-pointer px-3 py-1 outline-none border-none gap-2"
              onClick={() => handleExportTable("csv")}
            >
              <BsFiletypeCsv className=" h-4 w-4" />

              <span>CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-300 cursor-pointer px-3 py-1 outline-none border-none gap-2"
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
