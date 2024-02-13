import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CheckSquare, MoreHorizontal } from "react-feather";
import SprintTag from "../Tags/SprintTag";
import "./SprintCard.css";
import SprintCardDetails from "./CardDetails/SprintCardDetails";
const SprintCard = (props) => {
  useEffect(() => {
    console.log(props.card);
  });
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable
      key={props.card._id.toString()}
      draggableId={props.card._id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <SprintCardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="scustom__card"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="scard__text">
              <div style={{ maxHeight: "400px", width: "500px" }}>
                {props.title}
              </div>
              <MoreHorizontal
                className="scar__more"
                onClick={() => {
                  setDropdown(true);
                }}
              />
            </div>

            <div className="scard__tags">
              {props.tags?.map((item, index) => (
                <SprintTag
                  key={index}
                  tagName={item.tagName}
                  color={item.color}
                />
              ))}
            </div>

            <div className="scard__footer">
              {/* <div className="time">
                <Clock />
                <span>Sun 12:30</span>
              </div> */}
              {props.card.task.length !== 0 && (
                <div className="task">
                  <CheckSquare />
                  <span>
                    {props.card.task.length !== 0
                      ? `${
                          (props.card.task?.filter(
                            (item) => item.completed === true
                          )).length
                        } / ${props.card.task.length}`
                      : `${"0/0"}`}
                  </span>
                </div>
              )}
            </div>

            {provided.placeholder}
          </div>
        </>
      )}
    </Draggable>
  );
};

export default SprintCard;
