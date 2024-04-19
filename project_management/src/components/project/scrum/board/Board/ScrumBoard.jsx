import React, { useEffect, useState } from "react";
import SprintCard from "../../sprint/Card/SprintCard";
import "./ScrumBoard.css";
import { MoreHorizontal } from "react-feather";

import { Droppable } from "react-beautiful-dnd";
import { checkSession } from "../../../../sessioncheck/session";
import "./ScrumBoard.css";
import { useNavigate } from "react-router-dom";
export default function ScrumBoard(props) {
  const navigate = useNavigate();
  const [id, set_id] = useState(null);
  const [filter, setfilter] = useState(false);
  useEffect(() => {
    const getusrId = async () => {
      const user = await checkSession();
      console.log(user.id);
      set_id(user.id);
      if (user.message === "Session Expired") {
        navigate('/login', { state: user });
      }
    }
    getusrId();
    setfilter(props.filter);
  })
  var cnt = 0;
  return (
    <div className="sboard">
      <div className="board__top">
        <div style={{ width: "200px" }}>
          <p
            className="board__title"
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            {props?.name || "Name of Board"}
            {props.card?.map((items) => {
              console.log("Card Component Item:", items); // Log the item in each iteration
              const hasMemberId = items.members.some(member => member.member_id === id);
              cnt = hasMemberId ? cnt + 1 : cnt
            })}
            <span className="total__cards">{filter ? cnt : (props.card?.length)}</span>
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
            {props.card?.map((items, index) => {
              console.log("Card Component Item:", items); // Log the item in each iteration
              var hasMemberId = items.members.some(member => member.member_id === id);
              console.log(hasMemberId);
              hasMemberId = filter ? hasMemberId : 1;
              return hasMemberId && (<SprintCard
                bid={props.id}
                id={items._id}
                index={index}
                key={items._id}
                type={props.type}
                title={items.cardName}
                tags={items.tags}
                task={items.task}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
              );
            })}
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
