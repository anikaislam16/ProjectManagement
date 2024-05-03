import React, { useState, useEffect } from "react";

import { CheckSquare, MoreHorizontal } from "react-feather";
import SprintTag from "../../sprint/Tags/SprintTag";
import "./ScrumCompletedCard.css";
import SprintCardDetails from "../../sprint/Card/CardDetails/SprintCardDetails";
const ScrumCompletedCard = (props) => {
  useEffect(() => {
    console.log(props.card);
  });
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="ccard-container">
      {modalShow && (
        <SprintCardDetails
          updateCard={props.updateCard}
          onClose={setModalShow}
          card={props.card}
          index={props.index}
          bid={props.bid}
          completed={props.completed}
          removeCard={props.removeCard}
          onDrag={props.onDrag}
        />

      )}

      <div
        className="ccustom__card"
        onClick={() => {
          setModalShow(true);
        }}
      >
        <div className="ccard__text">
          <p>{props.title}</p>
          <MoreHorizontal
            className="ccar__more"
            onClick={() => {
              setDropdown(true);
            }}
          />
        </div>

        <div className="ccard__tags">
          {props.tags?.map((item, index) => (
            <SprintTag key={index} tagName={item.tagName} color={item.color} />
          ))}
        </div>

        <div className="ccard__footer">
          {/* <div className="time">
                <Clock />
                <span>Sun 12:30</span>
              </div> */}
          {props.card.task.length !== 0 && (
            <div className="task">
              <CheckSquare />
              <span>
                {props.card.task.length !== 0
                  ? `${(props.card.task?.filter(
                    (item) => item.completed === true
                  )).length
                  } / ${props.card.task.length}`
                  : `${"0/0"}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrumCompletedCard;
