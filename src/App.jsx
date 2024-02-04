import React, { useState } from "react";
import "./index.css";

const App = () => {
  const [cards, setCards] = useState([]);
  const [cardDetails, setCardDetails] = useState("");
  // New state to track the version of the card marked as Baseline and Final
  const [baselineVersion, setBaselineVersion] = useState(null);
  // const [finalVersion, setFinalVersion] = useState(null);

  const addCard = () => {
    if (!cardDetails.trim()) {
      alert("Please enter card details.");
      return;
    }

    let status = "Draft";

    if (baselineVersion !== null && cards.length + 1 > baselineVersion) {
      status = ""; // Status is empty for cards between baseline and final
    }

    const newCard = {
      id: cards.length + 1,
      version: cards.length + 1,
      status: status,
      details: cardDetails,
    };

    setCards([...cards, newCard]);
    setCardDetails("");
  };

  const markBaselineAndGenerateFinal = () => {
    setCards((prevCards) => {
      const baselineIndex = prevCards.length;
      const baselineCard = prevCards[baselineIndex - 1] || null;

      let newCards = prevCards.map((card, index) => ({
        ...card,
        status: index < baselineIndex - 1 ? card.status : "", // Empty status for cards between baseline and final
      }));

      if (baselineCard) {
        newCards[baselineIndex - 1] = { ...baselineCard, status: "Baseline" }; // Mark the last card as Baseline
        setBaselineVersion(baselineCard.version);
        // setFinalVersion(cards.length - 1); // Next card will be final

        const newFinalCard = {
          ...baselineCard,
          id: baselineCard.id + 1,
          version: baselineCard.version + 1,
          status: "Final"
        };

        return [...newCards, newFinalCard];
      }

      return [...newCards];
    });
  };

  // Dynamically determine the status of each card when rendering
  const getCardStatus = (card) => {
    console.log(cards.length - 1);
    

    if (card.version === baselineVersion) return "Baseline";
    if (baselineVersion && card.version === cards.length) return "Final";
    if (card.version < baselineVersion || baselineVersion === null)
      return "Draft";
    return ""; // This will be "" for cards between baseline and final
  };

  return (
    <div>
      <div className="button-group">
        <input
          type="text"
          value={cardDetails}
          onChange={(e) => setCardDetails(e.target.value)}
          placeholder="Enter Card Details"
        />
        <button onClick={addCard}>Add New Card</button>
        <button onClick={markBaselineAndGenerateFinal}>
          Mark Baseline & Generate Final
        </button>
      </div>
      {cards.map((card) => (
        <div key={card.id} className="card">
      
          <Card card={{ ...card, status: getCardStatus(card) }} />
        </div>
      ))}
    </div>
  );
};

const Card = ({ card }) => {
  return (
    <div>
      <h3>Card {card.version}</h3>
      <p>Status: {card.status}</p>
      <p>Version : {card.version}</p>
      <p>Details : {card.details}</p>
    </div>
  );
};

export default App;
