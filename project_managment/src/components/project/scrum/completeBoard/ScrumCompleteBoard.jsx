import React from "react";
import "./ScrumCompleteBoard.css"; // Import CSS file
import ScrumCompletedCard from "./completedCards/ScrumCompletedCard";

const ScrumCompleteBoard = (props) => {
  const { length, index } = props;
  const isLastItem = index === length - 1;
  console.log(index, length);
  return (
    <div>
      <div className="board-head " style={{ position: "sticky" }}>
        <div className="board-name">{props.item.name}</div>
        <div className="dates">
          <div>Sprint Start : {props.item.sprintStart}</div>
          <div>Sprint Finished : {props.item.sprintEnd}</div>
        </div>
      </div>
      <div className={"board-container" + (isLastItem ? " last-board" : "")}>
        <div className="card-container">
          {props.card?.map((items, index) => (
            <ScrumCompletedCard
              bid={props.id}
              id={items._id}
              index={index}
              key={items._id}
              title={items.cardName}
              tags={items.tags}
              task={items.task}
              updateCard={props.updateCard}
              removeCard={props.removeCard}
              card={items}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrumCompleteBoard;
