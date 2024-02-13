import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CheckSquare, MoreHorizontal } from "react-feather";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";
const Card = (props) => {
  useEffect(() => {
    console.log(props.card);
  });
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleMouseMove = (e) => {
    // Check if the scrollContainer prop is available
    if (props.scrollContainer && props.scrollContainer.current) {
      // Check if the mouse is near the top or bottom edge
      const threshold = 100; // Adjust as needed

      if (e.clientY < threshold) {
        // Scrolling up
        props.scrollContainer.current.scrollTop -= 10; // Adjust the scroll amount
      } else if (e.clientY > window.innerHeight - threshold) {
        // Scrolling down
        props.scrollContainer.current.scrollTop += 10; // Adjust the scroll amount
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Draggable
      key={props.card._id.toString()}
      draggableId={props.card._id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="custom__card"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{props.title}</p>
              <MoreHorizontal
                className="car__more"
                onClick={() => {
                  setDropdown(true);
                }}
              />
            </div>

            <div className="card__tags">
              {props.tags?.map((item, index) => (
                <Tag key={index} tagName={item.tagName} color={item.color} />
              ))}
            </div>

            <div className="card__footer">
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

export default Card;
