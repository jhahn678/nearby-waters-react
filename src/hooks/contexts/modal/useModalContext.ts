import { useContext } from "react";
import { ModalContext } from "./ModalContextProvider";

const useModalContext = () => useContext(ModalContext)

export default useModalContext;
