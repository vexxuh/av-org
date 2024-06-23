import React, { useState, useEffect, ReactHTMLElement } from "react";

// React Hot Toast
import { toast } from "react-hot-toast";

// axios
import axios from "axios";

// React Icons
import {
  HiOutlineChevronDoubleDown,
  HiOutlineFilter,
  HiOutlineLink,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";

// Components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/Collapsible";
import Button from "@/components/common/Button";
import Input from "@/components/FormElements/Input/ControlledInput";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/Command";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { cn } from "@/utils/functions/cn";
import { Paths } from "@/utils/config/paths";
import { useUser } from "@clerk/nextjs";

type DashboardFiltersProps = {
  submitFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  isLoading?: boolean;
};

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  submitFilters,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [querystrings, setQuerystrings] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [tags, setTags] = useState<
    { id: string; name: string; user_id: string }[]
  >([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const initialFilters: { [key: string]: any } = {};
    query.forEach((value, key) => {
      initialFilters[key] = value;
    });
    setFilters(initialFilters);
    setQuerystrings(new URLSearchParams(initialFilters).toString());
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const qs = new URLSearchParams(newFilters);
    setQuerystrings(qs.toString());
  };

  const handleFetchTags = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.TAG}`
      );

      setTags(data || []);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  useEffect(() => {
    if (user?.id) handleFetchTags();
  }, [user]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group">
      <div className="border-2 border-white rounded my-3 shadow-md text-[#415778]">
        <CollapsibleTrigger asChild>
          <div className="flex bg-white cursor-pointer items-center">
            <HiOutlineFilter className="font-bold h-5 w-5 ml-3 mb-1" />
            <p className="m-2 ml-2 font-bold text-lg h-8">Filters</p>
            <HiOutlineChevronDoubleDown className="w-4 h-4 mb-1 group-data-[state=open]:-rotate-180 transition duration-700" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 py-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="mb-2 ml-4 mr-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 h-[48px]">
            <Input
              id="manufacturer"
              placeholder="Manufacturer"
              className="h-[48px] outline-none bg-slate-300 text-[#415778] placeholder:text-[#415778] w-full px-3"
              rounded="rounded-md"
              parentStyles="bg-slate-300 text-[#415778] h-full"
              value={filters["manufacturer"] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange("manufacturer", e.target.value)
              }
              disabled={isLoading}
            />
            <Input
              id="device_model"
              placeholder="Device Model"
              className="h-[48px] outline-none bg-slate-300 text-[#415778] placeholder:text-[#415778] w-full px-3"
              rounded="rounded-md"
              parentStyles="bg-slate-300 text-[#415778] h-full"
              value={filters["device_model"] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange("device_model", e.target.value)
              }
              disabled={isLoading}
            />
            {/* <Input
              id="firmware"
              placeholder="Firmware"
              className="h-[48px] outline-none bg-slate-300 text-[#415778] placeholder:text-[#415778] w-full px-3"
              rounded="rounded-md"
              parentStyles="bg-slate-300 text-[#415778] h-full"
              value={filters["firmware"] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange("firmware", e.target.value)
              }
              disabled={isLoading}
            /> */}
            <div>
              <div className="flex flex-col h-[48px] outline-none  w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex h-12 w-full items-center justify-between cursor-pointer rounded-md shadow-md border border-input bg-slate-300 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {selectedTag
                        ? tags?.find((tag) => tag.id === selectedTag)?.name
                        : "Select Tag"}
                      <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-full md:min-w-[600px] w-full p-0 bg-slate-300">
                    <Command className="bg-slate-300">
                      <CommandInput placeholder="Search Customers..." />
                      <CommandList>
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                          {tags?.map((tag) => (
                            <CommandItem
                              value={tag.name}
                              key={tag.id}
                              onSelect={() => {
                                setSelectedTag(tag.id);
                                handleFilterChange("tag", tag.name);
                              }}
                            >
                              <LuCheck
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  tag.id === selectedTag
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {tag.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex justify-between ml-2 mr-2 pt-2">
            <div className="flex gap-3">
              <Button
                className="ml-2 bg-red-600 hover:bg-red-700 h-10"
                onClick={() => {
                  setFilters({});
                  setQuerystrings("");
                }}
                disabled={isLoading}
              >
                <HiOutlineX className="w-7 h-7" />
              </Button>
              <Button
                onClick={() => {
                  const allQueryStringsUrl =
                    window.location.origin +
                    window.location.pathname +
                    "?" +
                    new URLSearchParams(filters).toString();
                  navigator.clipboard.writeText(allQueryStringsUrl);
                  toast.success("Copied!", {
                    duration: 1500,
                    position: "top-center",
                  });
                }}
                className="h-10"
                variant="grey"
                disabled={isLoading}
              >
                <HiOutlineLink className="font-bold w-7 h-7" />
              </Button>
            </div>
            <div>
              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white p-3 h-10"
                iconStart={<HiOutlineSearch className="font-bold w-5 h-5" />}
                onClick={() => submitFilters(filters)}
                isLoading={isLoading}
                disabled={isLoading}
              >
                &nbsp; Search
              </Button>
            </div>
          </div>
          <div className="flex" id="queryZone">
            <pre className="p-1 px-2 m-2 rounded bg-[#415778] w-full h-8 text-white">
              {querystrings}
            </pre>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default DashboardFilters;
