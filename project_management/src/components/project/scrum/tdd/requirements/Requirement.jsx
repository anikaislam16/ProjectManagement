import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkSession } from "../../../../sessioncheck/session";
import "./Requirement.css";
import { Card, Button } from "react-bootstrap";
const Requirement = () => {
  const { projectId } = useParams();
  var [id, setid] = useState(null);
  const [boardId, setboard] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await checkSession();
        if (userData.hasOwnProperty("message")) {
          const datasend = { message: "Session Expired" };
          navigate("/login", { state: datasend });
        } else {
          setid((id = userData.id));
        }
        const response = await fetch(
          `${process.env.REACT_APP_HOST}/projects/scrum/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        const cards = data.boards[data.boards.length - 1].cards;
        setboard(data.boards[data.boards.length - 1]._id);
        const filteredCards = cards.filter((card) => {
          return card.members.some(
            (member) => member.member_id === id && !card.tddActive
          );
        });
        setCards(filteredCards);
      } catch (error) {
        console.error("Error fetching project data:", error.message);
      }
    };
    fetchData();
  }, [projectId]);
  const handleMoveToTDD = async (cardId) => {
    try {
      const requestBody = {
        fieldName: "tddActive",
        newValue: true, // Set the new value for tddActive
      };
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/projects/scrum/${projectId}/${boardId}/${cardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tddActive");
      }
      console.log("TDD Active updated successfully");
      setCards(cards.filter((card) => card._id !== cardId));
    } catch (error) {
      console.error("Error updating TDD Active:", error.message);
      // Handle error as needed
    }
  };
  return (
    <div className="card-list-container">
      <br />
      <br />
      <h4>Your Cards</h4>
      {cards.map((card) => (
        <Card key={card.cardName} className="card-item">
          <Card.Body>
            <Card.Title>{card.cardName}</Card.Title>
            {/* Add other card details as needed */}
            <div className="d-flex justify-content-end">
              {" "}
              {/* Align button to the right */}
              <Button
                variant="primary"
                onClick={() => handleMoveToTDD(card._id)}
              >
                Move to TDD
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Requirement;
