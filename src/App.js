import { useEffect, useState } from "react";
import { evaluate } from "mathjs";

const buttons = [
  "7",
  "8",
  "9",
  "DEL",
  "4",
  "5",
  "6",
  "+",
  "1",
  "2",
  "3",
  "-",
  ".",
  "0",
  "/",
  "*",
  "RESET",
  "=",
];

const operators = ["+", "-", "*", "/"];

function App() {
  const [expression, setExpression] = useState("");

  function isOperator(val) {
    return operators.includes(val);
  }

  function handleClick(btn) {
    if (btn === "RESET") {
      setExpression("");
      return;
    }

    if (btn === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (btn === "=") {
      handleEquals();
      return;
    }

    setExpression((prev) => {
      if (!prev && isOperator(btn)) return prev;

      if (isOperator(btn) && isOperator(prev.slice(-1))) {
        return prev.slice(0, -1) + btn;
      }

      if (btn === ".") {
        const lastNumber = prev.split(/[+\-*/]/).pop();
        if (lastNumber.includes(".")) return prev;
      }

      return prev + btn;
    });
  }

  function handleEquals() {
    try {
      const result = evaluate(expression);
      const formatted = parseFloat(result.toFixed(6));

      setExpression(String(formatted));
    } catch {
      setExpression("Error");
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (!isNaN(e.key) || ["+", "-", "*", "/", "."].includes(e.key)) {
        handleClick(e.key);
      }

      if (e.key === "Enter") handleEquals();
      if (e.key === "Backspace") {
        setExpression((prev) => prev.slice(0, -1));
      }
      if (e.key === "Escape") setExpression("");
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expression, handleClick, handleEquals]);

  return (
    <div className="app">
      <header>
        <h1>Calculator</h1>
      </header>

      <div className="calc-total">{expression || "0"}</div>

      <div className="calc-inputs">
        {buttons.map((btn, index) => {
          let className = "";

          if (btn === "DEL") className = "del";
          if (btn === "RESET") className = "reset";
          if (btn === "=") className = "equals";

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
