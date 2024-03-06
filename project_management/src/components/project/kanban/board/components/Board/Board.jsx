import React, { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { MoreHorizontal } from "react-feather";
import Card from "../Card/Card";

import Editable from "../Editable/Editable";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";
import "./Board.css";
export default function Board(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    console.log("Board Component Items:", props);
    document.addEventListener("keypress", (e) => {
      if (e.code === "Enter") setShow(false);
    });
    return () => {
      document.removeEventListener("keypress", (e) => {
        if (e.code === "Enter") setShow(false);
      });
    };
  });

  return (
    <div className="Ssboard">
      <div className="board__top">
        {show ? (
          <div>
            <input
              className="title__input"
              type={"text"}
              defaultValue={props.name}
              onChange={(e) => {
                props.setName(e.target.value, props.id);
              }}
            />
          </div>
        ) : (
          <div>
            <p
              onClick={() => {
                setShow(true);
              }}
              className="board__title"
            >
              {props?.name || "Name of Board"}
              <span className="total__cards">{props.card?.length}</span>
            </p>
          </div>
        )}
        <Dropdown
          className="board__dropdown"
          show={dropdown}
          style={{ backgroundColor: "#F1F8F5" }}
          onClick={() => setDropdown(!dropdown)}
        >
          <Dropdown.Toggle as={MoreHorizontal}></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => props.removeBoard(props.id)}>
              Delete Board
            </Dropdown.Item>
            {props.workflow === false && props.index === props.length && (
              <Dropdown.Item onClick={() => props.setProjectWorkFlow()}>
                Complete Workflow
              </Dropdown.Item>
            )}
            {/* Add more Dropdown.Items for other actions */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => {
              console.log("Card Component Item:", items); // Log the item in each iteration
              return (
                <Card
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
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="board__footer">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value) => props.addCard(value, props.id)}
        />
      </div>
    </div>
  );
}
