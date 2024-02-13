import React, { useState } from "react";
import SidebarContextScrum from "./SidebarContextScrum";

const SidebarContextScrumProvider = (props) => {
  const [open, setOpen] = useState(true); // Use setOpen as the updater function

  // You can also define any other state variables and functions you need here

  return (
    <SidebarContextScrum.Provider value={{ open, setOpen }}>
      {props.children}
    </SidebarContextScrum.Provider>
  );
};

export default SidebarContextScrumProvider;
