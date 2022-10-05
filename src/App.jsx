import logo from "./logo.svg";
import "./App.css";
import { useRef, useState } from "react";
function App() {
  const inputRef = useRef(null);
  const [fileHeader, setFileHeader] = useState([]);
  const [fileData, setFileData] = useState([]);

  const [raffleEntries, setRaffleEntries] = useState([]);
  const [finalEntries, setFinalEntries] = useState([]);

  const [winners, setWinners] = useState([]);
  const [prizes, setPrizes] = useState([
    "Gcash",
    "Lazada Voucher",
    "Shopee Voucher",
    "Puregold Voucher",
    "Shopwise Voucher",
    "Robinsons Voucher",
    "KTM RC 390 2018",
  ]);

  const [selectedPrize, setSelectedPrize] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const onFileUpload = () => {
    const file = inputRef.current.files[0];

    const reader = new FileReader();

    reader.readAsText(file);
    setIsLoading(true);

    reader.onload = function (e) {
      let contents = e.target.result;

      let headers = contents
        .split("\n")[0]
        .split(",")
        .map((header) => {
          return header.replace("\r", "");
        });

      let data = contents
        .split("\n")
        .slice(1)
        .map((row) => {
          return row.split(",").map((cell) => {
            return cell.replace("\r", "");
          });
        });

      setFileData(data);
      setFileHeader(headers);

      const raffleEntries = data.map((row) => {
        return {
          name: row[0],
          entries: parseInt(row[1]),
        };
      });
      setRaffleEntries(raffleEntries);

      let entries = [];

      raffleEntries.forEach((entry) => {
        for (let i = 0; i < entry.entries; i++) {
          entries.push(entry.name);
        }
      });

      setFinalEntries(entries);
      setIsLoading(false);
      return entries;
    };
  };

  const handleGenerateWinner = () => {
    const winner =
      finalEntries[Math.floor(Math.random() * finalEntries.length)];

    if (selectedPrize === null) {
      alert("Please select a prize first!");
      return;
    }
    alert(`Congratulations ${winner}! You won a ${selectedPrize}!`);

    const updatedFinalEntries = finalEntries.filter((entry) => {
      return entry !== winner;
    });

    setWinners((prev) => [
      ...prev,
      {
        name: winner,
        prize: selectedPrize,
      },
    ]);

    setFinalEntries(updatedFinalEntries);
  };

  const prizesOptions = prizes.map((prize, index) => {
    return (
      <option key={index} value={prize}>
        {prize}
      </option>
    );
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const data = [
    { option: "0", style: { backgroundColor: "green", textColor: "black" } },
    { option: "1", style: { backgroundColor: "black" } },
    { option: "2" },
  ];
  console.log(winners);
  return (
    <div className="App">
      <input type="file" ref={inputRef} onChange={onFileUpload} />

      <select onChange={(e) => setSelectedPrize(e.target.value)}>
        <option value="">Select a prize</option>
        {prizesOptions}
      </select>

      <div>
        {fileHeader.map((header, idx) => (
          <span key={idx}>{header} </span>
        ))}

        <br />
        {raffleEntries.map((entry, idx) => (
          <div key={idx}>
            <span>{entry.name} - </span>
            <span>{entry.entries}</span>
          </div>
        ))}

        <br />
        {/* {finalEntries.map((entry, idx) => {
          return <div key={idx}>{entry}</div>;
        })} */}

        <h1>Winners</h1>
        {winners.map((winner, idx) => {
          return (
            <div key={idx}>
              {winner.name} - {winner.prize}
            </div>
          );
        })}

        <button
          onClick={handleGenerateWinner}
          disabled={fileData.length <= 0 || finalEntries.length <= 0}
        >
          Generate Winner
        </button>
      </div>
    </div>
  );
}
export default App;
