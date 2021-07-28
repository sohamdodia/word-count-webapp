import "./App.css";
import { useEffect, useState } from "react";
import * as API from "./API";

const App = () => {
  const [url, setUrl] = useState("");
  const [words, setWords] = useState(null);
  const [history, setHistory] = useState(null);
  const [sortBy, setSortBy] = useState("word");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  useEffect(() => {
    const data = localStorage.getItem("history");
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  const saveHistory = (url) => {
    // TODO: Store as Array (Set) instead of Object
    let urls = localStorage.getItem("history");
    if (urls) {
      urls = JSON.parse(urls);
      urls[url] = "visited";
    } else {
      urls = {};
      urls[url] = "visited";
    }
    localStorage.setItem("history", JSON.stringify(urls));
    setHistory(urls);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url) {
      alert("Please enter url!");
      return;
    }
    setLoading(true);
    setWords(null);
    try {
      const res = await API.POST({
        url: `/word-count?sortBy=${sortBy}&sortOrder=${sortOrder}`,
        data: { url },
      });
      setWords(res.data.data);
      saveHistory(url);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "something went wrong");
    }
    setLoading(false);
  };

  const handleHistoryClick = (h) => {
    setUrl(h);
  };

  return (
    <div className="App">
      <h1>Extract text from website</h1>

      {history && (
        <div>
          <h2>Previously Visited URLs</h2>
          <ul>
            {Object.keys(history).map((h) => {
              return <li onClick={() => handleHistoryClick(h)}>{h}</li>;
            })}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label for="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={handleChange}
        />

        <input type="submit" value="Count Words" disabled={loading} />
        <div
          onChange={(event) => setSortBy(event.target.value)}
          className="radio-buttons"
        >
          <h4>Sort By: </h4>
          <div>
            <input
              type="radio"
              value="word"
              name="word"
              id="word"
              checked={sortBy === "word"}
            />{" "}
            <label for="word">Word</label>
            <input
              type="radio"
              value="count"
              name="count"
              id="count"
              checked={sortBy === "count"}
            />{" "}
            <label for="count">Count</label>
          </div>
        </div>
        <div
          onChange={(event) => setSortOrder(event.target.value)}
          className="radio-buttons"
        >
          <h4>Sort Order: </h4>
          <input
            type="radio"
            value="asc"
            name="asc"
            id="asc"
            checked={sortOrder === "asc"}
          />{" "}
          <label for="asc">ASC</label>
          <input
            type="radio"
            value="desc"
            name="desc"
            id="desc"
            checked={sortOrder === "desc"}
          />{" "}
          <label for="desc">DESC</label>
        </div>
      </form>
      {loading && <p>Fetching data...</p>}
      {words && (
        <div>
          <h2>Words</h2>
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {words.map((w) => {
                return (
                  <tr key={w.word}>
                    <td>{w.word}</td>
                    <td>{w.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
