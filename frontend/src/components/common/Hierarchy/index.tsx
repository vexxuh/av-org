import React, { useState } from "react";

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

const isPathType = (type: string): type is keyof typeof Paths => {
  return type.toUpperCase() in Paths;
};

const TreeNode: React.FC<{
  data: Node[];
  node: Node;
  setData: React.Dispatch<React.SetStateAction<Node[]>>;
  parentId?: string;
  parentType?: "customer" | "location";
}> = ({ node, setData, data, parentId, parentType }) => {
  const { user } = useUser();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (
    type: "customer" | "location" | "room",
    id: string
  ) => {
    setDeleteLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${
          Paths[type.toUpperCase() as "CUSTOMER" | "LOCATION" | "ROOM"]
        }/${id}?user_id=${user?.id}`
      );

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );

      const newData = data
        .map((item) => {
          if (type === "customer" && item.id === id) {
            return null;
          } else if (
            type === "location" &&
            parentType === "customer" &&
            item.id === parentId
          ) {
            return {
              ...item,
              locations: item.locations?.filter((loc) => loc.id !== id),
            };
          } else if (
            type === "room" &&
            parentType === "location" &&
            item.id === parentId
          ) {
            return {
              ...item,
              rooms: item.rooms?.filter((room) => room.id !== id),
            };
          }
          return item;
        })
        .filter(Boolean) as Node[];

      setData(newData);
    } catch (err) {
      console.log(err);
      toast.error(`Failed to delete ${type}`);
    }
    setDeleteLoading(false);
  };

  return (
    <div
      className={`${
        node?.locations ? "bg-gray-300 py-5 px-3 rounded-md cursor-pointer" : ""
      }`}
    >
      <div className={`flex items-center justify-between gap-4`}>
        <h3 className={node?.locations ? "font-bold" : ""}>{node.name}</h3>

        <div className="flex items-center gap-3">
          <Button variant="green" size="sm" icon={true}>
            <FaRegEdit fontSize={18} />
          </Button>
          <Button
            variant="red"
            size="sm"
            onClick={() => {
              if (parentType === "customer") {
                handleDelete("location", node.id);
              } else if (parentType === "location") {
                handleDelete("room", node.id);
              } else {
                handleDelete("customer", node.id);
              }
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
              parentType="customer"
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
                  <Button
                    variant="red"
                    size="sm"
                    onClick={() => handleDelete("room", child.id)}
                    icon={true}
                  >
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
