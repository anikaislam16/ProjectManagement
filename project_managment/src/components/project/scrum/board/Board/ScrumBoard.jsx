import React, { useEffect, useState } from "react";
import SprintCard from "../../sprint/Card/SprintCard";
import "./ScrumBoard.css";
import { MoreHorizontal } from "react-feather";

import { Droppable } from "react-beautiful-dnd";

import "./ScrumBoard.css";
export default function ScrumBoard(props) {
  return (
    <div className="sboard">
      <div className="board__top">
        <div style={{ width: "200px" }}>
          <p
            className="board__title"
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            {props?.name || "Name of Board"}
            <span className="total__cards">{props.card?.length}</span>
          </p>
        </div>
      </div>
      <Droppable droppableId={props.bb.toString()}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <SprintCard
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
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="board__footer">
        {/* <SprintEditable
         name={"Add Card"}
         btnName={"Add Card"}
         placeholder={"Enter Card Title"}
         onSubmit={(value) => props.addCard(value, props.id)}
       /> */}
      </div>
    </div>
  );
}
