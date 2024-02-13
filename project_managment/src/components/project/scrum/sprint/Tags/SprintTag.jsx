import React from "react";
import "./SprintTag.css";
const SprintTag = (props) => {
  return (
    // <div className='tag'>
    <sapn className="tag" style={{ backgroundColor: `${props?.color}` }}>
      {props?.tagName}
    </sapn>
    // </div>
  );
};

export default SprintTag;
