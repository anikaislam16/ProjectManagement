import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { checkSession } from "../../../../sessioncheck/session";
import TestCard from "./testCard";
export default function TestPlanKanban() {
  var [id, setId] = useState(null);
  const { projectId } = useParams();
  //  const [boardId, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await checkSession();
        if (userData.hasOwnProperty("message")) {
          const datasend = { message: "Session Expired" };
          navigate("/login", { state: datasend });
          return;
        } else {
          setId((id = userData.id));
        }

        const response = await fetch(
          `${process.env.REACT_APP_HOST}/projects/kanban/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        let cards = [];

        // Iterate over each board
        data.boards.forEach((board) => {
          board.cards.forEach((card) => {
            card.board_id = board._id;
            cards.push(card);
          });
        });

        const filteredCards = await cards.filter((card) => {
          return card.members.some(
            (member) => member.member_id === userData.id && card.tddActive
          );
        });

        setCards(filteredCards);
      } catch (error) {
        console.error("Error fetching project data:", error.message);
      }
    };
    fetchData();
  }, [projectId, navigate]);
  return (
    <div>
      {cards.map((card) => (
        <TestCard key={card._id} id={id} card={card} />
      ))}
    </div>
  );
}
