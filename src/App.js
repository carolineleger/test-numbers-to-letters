import { useState } from "react";
import "./App.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ones, tens, bigNumbers } from "./data/numbers";

function App() {
  const [num, setNum] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const resultInitState = { dollars: "", cents: "" };

  const [result, setResult] = useState(resultInitState);

  const handleInputChange = (e) => {
    setNum(e.target.value);
  };

  const onSubmit = () => {
    setErrorMessage("");
    setResult(resultInitState);

    if (checkIfNumbers(num)) {
      let dollarValue = parseFloat(num.split(".")[0]);
      let centsValue = num.split(".")[1]; //we keep it as a string for now, we need to handle trailing 0 in cents
      const dollars = convertToCharacters(dollarValue);
      const cents = handleCents(centsValue);

      setResult({ dollars: dollars, cents: cents });
    } else {
      setErrorMessage("Please enter a valid price");
    }
  };

  // check if the user entered numbers only
  const checkIfNumbers = (value) => {
    const regex = /^(?!0\d)\d+(\.\d{1,2})?$/;

    //check if it's a number or decimal number and there's no trailing 0
    //should not be longer than a trillon and shouldn't have nore than 2 number as decimals
    return regex.test(value) && value.length <= 13;
  };

  //special case for cents, 12.2. .2 would be 20 not 2
  const handleCents = (cents) => {
    if (cents) {
      const centsString = cents.toString();
      if (centsString.length < 2) {
        cents = centsString + "0";
      }
      return convertToCharacters(parseFloat(cents));
    }
    return "";
  };

  //convert to words
  const convertToCharacters = (value) => {
    if (value === 0) {
      return "Zero";
    }

    if (value < 20) {
      return ones[value];
    }

    //tens
    if (value >= 20 && value < 100) {
      return tens[Math.floor(value / 10)] + " " + ones[value % 10];
    }

    //hundreds
    if (value >= 100 && value < 1000) {
      const hundreds = Math.floor(value / 100);
      const remainder = value - hundreds * 100;
      const remainderPart =
        remainder > 0 ? " and " + convertToCharacters(remainder) : "";

      // hunderts
      return ones[hundreds] + " hundred" + remainderPart;
    }

    // values over 1000
    // Loop through bigNumbers array to handle billions, trillions, etc.
    //we're starting in reverse from the largest number (set as trillions)
    for (let i = 4; i >= 0; i--) {
      // we divide by the power
      // For example, when i is 4 (for trillion), the divisor is 1000^4.
      const divisor = Math.pow(1000, i);
      if (Math.floor(value / divisor) > 0) {
        // Convert the rest recursively and append the appropriate unit word
        return (
          convertToCharacters(Math.floor(value / divisor)) +
          " " +
          bigNumbers[i] +
          (value % divisor !== 0
            ? " " + convertToCharacters(value % divisor)
            : "")
        );
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>
          Welcome to this price to characters converter! <br /> Please enter a
          price in the field below and you'll see it as characters.
        </h1>
      </header>

      <main>
        <div className="layout">
          <p className="text-center">
            <b>Enter a price up to a trillion.</b>
          </p>
          <div className="flex">
            <TextField
              type="number"
              placeholder="Example: 125.12"
              variant="outlined"
              value={num}
              onChange={(e) => handleInputChange(e)}
            />
            <Button
              variant="contained"
              onClick={(e) => onSubmit(e)}
              size="large"
            >
              Convert!
            </Button>
          </div>

          <p className="red text-center">{errorMessage}</p>

          {result.dollars && (
            <p className="text-center">
              Your result is: <b>{result.dollars}</b> dollars{" "}
              {result.cents && (
                <span>
                  {" "}
                  and <b>{result.cents}</b> cents
                </span>
              )}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
