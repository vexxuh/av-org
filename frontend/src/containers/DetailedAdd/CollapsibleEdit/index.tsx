import React, { useState } from "react";

// React Icons
import { HiOutlineChevronDoubleDown } from "react-icons/hi";

// Components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/Collapsible";
import EditContainer from "@/containers/Edit";

type CollapsibleEditProps = {
  id: string;
};

const CollapsibleEdit: React.FC<CollapsibleEditProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      className="group w-full bg-slate-300 shadow-md rounded-md p-3"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div>
        <CollapsibleTrigger asChild>
          <div className="w-full flex items-center justify-between text-slate-600 cursor-pointer">
            <h3 className="text-lg font-medium">Edit Gear: [{id}]</h3>

            <h3>
              <HiOutlineChevronDoubleDown className="group-data-[state=open]:-rotate-180 transition duration-700" />
            </h3>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-2 py-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down duration-1500">
          <EditContainer pathId={id} redirection={false} />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CollapsibleEdit;
