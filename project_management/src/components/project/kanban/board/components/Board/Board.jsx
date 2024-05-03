import React, { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { MoreHorizontal } from "react-feather";
import Card from "../Card/Card";
import { checkSession } from "../../../../../sessioncheck/session";
import Editable from "../Editable/Editable";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";
import "./Board.css";
import { useNavigate } from "react-router-dom";
export default function Board(props) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
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
  var cnt = 0;
  return (
    <div className="Ssboard" style={{ width: '400px' }}>
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
                props.role === 'admin' && setShow(true);
              }}
              className="board__title"
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
        )}
        {props.role === 'admin' && <Dropdown
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
        </Dropdown>}
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
              var hasMemberId = items.members.some(member => member.member_id === id);
              console.log(hasMemberId);
              hasMemberId = filter ? hasMemberId : 1;
              return hasMemberId && (
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
      {props.role === 'admin' && <div className="board__footer">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value) => props.addCard(value, props.id)}
        />
      </div>}
    </div>
  );
}
