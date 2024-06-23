import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import { checkSession } from "../../../../sessioncheck/session";
import "./TestDesign.css";
import { Card, Button } from "react-bootstrap";
const TestDesign = () => {
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
            (member) => member.member_id === id && card.tddActive
          );
        });
        setCards(filteredCards);
      } catch (error) {
        console.error("Error fetching project data:", error.message);
      }
    };
    fetchData();
  }, [projectId]);
  const handleAddtest = async (card) => {
    navigate(`test`, { state: { card: card, boardId: boardId, id: id } });
  };
  const handleMoveToRequirement = async (cardId) => {
    try {
      const requestBody = {
        fieldName: "tddActive",
        newValue: false, // Set the new value for tddActive
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
      console.log("TDD de-Active updated successfully");
      setCards(cards.filter((card) => card._id !== cardId));
    } catch (error) {
      console.error("Error updating TDD de-Active:", error.message);
      // Handle error as needed
    }
  };
  return (
    <div className="card-list-container">
      <br />
      <br />
      <h4>Test Cards</h4>
      {cards.map((card) => (
        <Card key={card.cardName} className="card-item">
          <Card.Body>
            <Card.Title style={{ marginLeft: "550px", textAlign: "left" }}>
              {card.cardName}
            </Card.Title>
            {/* Add other card details as needed */}
            <div
              className="d-flex justify-content-end"
              style={{ marginTop: "10px" }}
            >
              {" "}
              {/* Align button to the right and add top margin */}
              <Button
                variant="primary"
                style={{ marginRight: "10px", marginBottom: "5px" }}
                onClick={() => handleMoveToRequirement(card._id)}
              >
                Move to Requirements
              </Button>{" "}
              {/* Add margin to the right of the button */}
              <Button
                variant="primary"
                style={{ marginBottom: "5px" }}
                onClick={() => handleAddtest(card)}
              >
                Add Test Suite
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
      {/* TestDesign
      <button onClick={() => navigate(`/project/scrum/${projectId}/tdd/test`)}>
        Click
      </button>
      <Outlet /> */}
      <Outlet />
    </div>
  );
};

export default TestDesign;
