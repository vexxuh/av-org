import React from "react";

// Styled
import { ModalBackdrop, ModalStyled, ModalWrapper } from "./styled";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-[1000] flex items-center justify-center bg-black bg-opacity-60">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative overflow-hidden">{children}</div>
    </div>
  );
};

export default Modal;
