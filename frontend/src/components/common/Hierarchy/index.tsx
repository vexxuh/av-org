import React, { use, useState } from "react";

// Clerk
import { useUser } from "@clerk/nextjs";

// React Icons
import { MdOutlineAdd, MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

// React Hot Toast
import toast, { Toaster } from "react-hot-toast";

// axios
import axios from "axios";

// Components
import Button from "../Button";

// Utils
import { Paths } from "@/utils/config/paths";

export type Node = {
  id: string;
  name: string;
  locations?: Node[];
  rooms?: Node[];
};

const TreeNode: React.FC<{
  data: Node[];
  node: Node;
  setData: React.Dispatch<React.SetStateAction<Node[]>>;
  parentId?: string;
}> = ({ node, setData, data, parentId }) => {
  const { user } = useUser();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteLocation = async (id: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${Paths.LOCATION}/${id}?user_id=${user?.id}`
      );

      toast.success("Location deleted successfully");

      const newData = data.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            locations: item.locations?.filter((loc) => loc.id !== id),
          };
        }
        return item;
      });
      setData(newData);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete location");
    }
    setDeleteLoading(false);
  };

  return (
    <div
      className={`ml-4 ${
        node?.locations ? "bg-gray-300 py-5 px-3 rounded-md cursor-pointer" : ""
      }`}
    >
      <div className={`flex items-center justify-between gap-4`}>
        <h3 className={node?.locations ? "font-bold" : ""}>{node.name}</h3>

        <div className="flex items-center gap-3">
          {node?.locations && (
            <Button variant="grey" size="sm" icon={true}>
              <MdOutlineAdd fontSize={18} />
            </Button>
          )}
          <Button variant="green" size="sm" icon={true}>
            <FaRegEdit fontSize={18} />
          </Button>
          <Button
            variant="red"
            size="sm"
            onClick={() => {
              !node?.locations && handleDeleteLocation(node.id);
            }}
            isLoading={deleteLoading}
            icon={true}
          >
            <MdOutlineDeleteOutline fontSize={18} />
          </Button>
        </div>
      </div>
      {node?.locations && node?.locations?.length > 0 && (
        <div className="ml-8 mt-2 flex flex-col gap-4">
          {node?.locations?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              setData={setData}
              data={data}
              parentId={node?.id}
            />
          ))}
        </div>
      )}

      {node?.rooms && node?.rooms?.length > 0 && (
        <div className="ml-8 mt-2 flex flex-col gap-4">
          {node?.rooms?.map((child) => (
            <div key={child.id} className="ml-4">
              <div className="flex items-center justify-between gap-4">
                <h3>{child.name}</h3>
                <div className="flex items-center gap-3">
                  <Button variant="green" size="sm" icon={true}>
                    <FaRegEdit fontSize={18} />
                  </Button>
                  <Button variant="red" size="sm" icon={true}>
                    <MdOutlineDeleteOutline fontSize={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Hierarchy: React.FC<{
  data: Node[];
  setData: React.Dispatch<React.SetStateAction<Node[]>>;
}> = ({ data, setData }) => {
  return (
    <div className="w-full flex flex-col gap-10">
      <Toaster />
      {data?.map((node) => (
        <TreeNode node={node} key={node.id} setData={setData} data={data} />
      ))}
    </div>
  );
};

export default Hierarchy;
