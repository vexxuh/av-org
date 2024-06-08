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
    <div className="flex p-2 mt-6 justify-between w-full">
      <p className="text-sm">{pageString}</p>
      <div className="flex justify-end gap-2">
        <Button
          className="h-6 bg-phpc-blue dark:bg-phpc-blue-dark hover:bg-phpc-blue-dark dark:hover:bg-phpc-blue "
          onClick={() => {
            changePage(1);
          }}
          variant="grey"
        >
          <HiOutlineChevronDoubleLeft className="font-bold h-4 w-4" />
        </Button>

        <Button
          className="h-6 bg-phpc-blue dark:bg-phpc-blue-dark hover:bg-phpc-blue-dark dark:hover:bg-phpc-blue "
          onClick={() => {
            changePage(currentPage - 1);
          }}
          variant="grey"
        >
          <HiOutlineChevronLeft className="font-bold h-4 w-4" />
        </Button>

        <p className="text-center bg-[#415778c7] text-white rounded-md px-3">
          {currentPage}
        </p>

        <Button
          className="h-6 bg-phpc-blue dark:bg-phpc-blue-dark hover:bg-phpc-blue-dark dark:hover:bg-phpc-blue "
          onClick={() => {
            changePage(currentPage + 1);
          }}
          variant="grey"
        >
          <HiOutlineChevronRight className="font-bold h-4 w-4" />
        </Button>

        <Button
          className="h-6 bg-phpc-blue dark:bg-phpc-blue-dark hover:bg-phpc-blue-dark dark:hover:bg-phpc-blue "
          onClick={() => {
            changePage(totalPages);
          }}
          variant="grey"
        >
          <HiOutlineChevronDoubleRight className="font-bold h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
