import React, { useState } from "react";

// React Icons
import { BsFiletypeCsv, BsFiletypeXlsx } from "react-icons/bs";
import { CiExport, CiSearch } from "react-icons/ci";

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
import Input from "@/components/FormElements/Input/ControlledInput";
import { FaSearch } from "react-icons/fa";

type DashboardHeaderProps = {
  limit: number;
  handleUpdateLimit: (limit: number) => void;
  handleExportTable: (type: string) => void;
  handleFetchItems: (search: string) => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  limit,
  handleUpdateLimit,
  handleExportTable,
  handleFetchItems,
}) => {
  const [search, setSearch] = useState("");
  return (
    <div className="p-3 w-full justify-between md:flex bg-white mb-4 rounded-lg h-full">
      <div className="flex items-center w-full mb-3 md:mb-0">
        <div className="max-w-[800px] w-full md:w-auto">
          <Select
            value={limit.toString()}
            onValueChange={(value) => handleUpdateLimit(parseInt(value))}
            defaultValue="25"
          >
            <SelectTrigger
              className="bg-[#415778] w-full md:w-32 h-11 shadow-md rounded-md text-white"
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
      <div className="flex w-full md:w-auto nd:h-[42px] gap-3 flex-col md:flex-row">
        <div className="max-w-[800px] md:max-w-96 w-full">
          <Input
            id="search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            placeholder="Search"
            icon={<FaSearch />}
            mb={0}
            value={search}
            className="h-11 outline-none bg-slate-300 text-[#415778] placeholder:text-[#415778]"
            rounded="rounded-md"
            parentStyles="bg-slate-300 text-[#415778] h-full"
          />
        </div>

        <Button
          variant="grey"
          size="sm"
          className="rounded-md border text-popover-foreground shadow-md flex gap-2 max-w-[800px] w-full h-11"
          iconStart={<CiSearch fontSize={16} />}
          onClick={() => handleFetchItems(search)}
        >
          Search
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="max-w-[800px] w-full">
            <span>
              <Button
                className="rounded-md border text-popover-foreground shadow-md  flex gap-2 h-11"
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
