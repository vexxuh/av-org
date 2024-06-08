import Input from "@/components/FormElements/Input/ControlledInput";
import Button from "@/components/common/Button";
import React from "react";

// React Icons
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

const TablePagination: React.FC<any> = ({
  changePage,
  currentPage,
  totalPages,
  pageString,
}) => {
  return (
    <div className="flex p-2 mt-6 min-[400px]:justify-between w-full flex-wrap items-center max-[400px]:justify-center gap-2">
      <p className="text-sm">{pageString}</p>
      <div className="flex justify-end gap-2 max-[400px]:flex-wrap">
        <Button
          className="h-6"
          onClick={() => {
            changePage(1);
          }}
          variant="grey"
          title="First"
        >
          <HiOutlineChevronDoubleLeft className="font-bold h-4 w-4" />
        </Button>

        <Button
          className="h-6"
          onClick={() => {
            changePage(currentPage - 1);
          }}
          variant="grey"
          title="Previous"
        >
          <HiOutlineChevronLeft className="font-bold h-4 w-4" />
        </Button>

        <p className="text-center bg-[#415778c7] text-white rounded-md px-3 w-full">
          {currentPage}
        </p>

        <Button
          className="h-6"
          onClick={() => {
            changePage(currentPage + 1);
          }}
          variant="grey"
          title="Next"
        >
          <HiOutlineChevronRight className="font-bold h-4 w-4" />
        </Button>

        <Button
          className="h-6"
          onClick={() => {
            changePage(totalPages);
          }}
          variant="grey"
          title="Last"
        >
          <HiOutlineChevronDoubleRight className="font-bold h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
