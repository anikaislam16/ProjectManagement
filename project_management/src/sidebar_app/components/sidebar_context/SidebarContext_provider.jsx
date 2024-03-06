import React, { useState } from "react";
import SidebarContext from "./SidebarContext";

const SidebarContextProvider = (props) => {
  const [open, setOpen] = useState(true); // Use setOpen as the updater function

  // You can also define any other state variables and functions you need here

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
