import React from "react";

// Components
import Modal from "@/components/common/Modal";
import { LuAlertTriangle } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import Button from "@/components/common/Button";

type DeleteAlertModalProps = {
  onClose: () => void;
  handleDelete: () => void;
  isDeleting: boolean;
};

const DeleteAlertModal: React.FC<DeleteAlertModalProps> = ({
  onClose,
  handleDelete,
  isDeleting,
}) => {
  return (
    <Modal onClose={onClose}>
      <div className="bg-white p-5 rounded-lg w-[450px] text-black flex flex-col gap-10 py-10">
        <header className="flex items-center justify-center w-full">
          <h1 className="text-2xl font-bold w-full">Delete Location</h1>

          <span
            className="flex justify-end w-1/2 cursor-pointer"
            onClick={onClose}
          >
            <IoMdClose fontSize={26} />
          </span>
        </header>

        <div className="flex items-center justify-center w-full flex-col gap-10">
          <div className="text-red-500 flex items-center justify-center">
            <LuAlertTriangle fontSize={70} />
          </div>

          <p className="text-lg text-center">
            Are you sure you want to delete this location? This will remove the
            binding of the rooms to a location.
          </p>
          <div className="flex justify-end gap-5">
            <Button onClick={onClose} disabled={isDeleting} variant="grey">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
              variant="red"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAlertModal;
