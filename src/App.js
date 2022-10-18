import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import axios from "axios";
function App() {
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);
  const { register, handleSubmit } = useForm();
  const [name, setName] = useState();
  const [msg, setMsg] = useState();

  const onSubmit = (e) => {
    const data = {
      username: e.username,
      message: e.chat,
    };

    axios
      .post("http://localhost:3000/post", data)
      .then(() => {
        setFacts((facts) => facts.concat(data));
        // setFacts(data);
        setName(e.username);
        setMsg(e.chat);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // console.log("facts",facts)

  useEffect(() => {
    if (!listening) {
      const events = new EventSource("http://localhost:3000/events");

      events.onmessage = (event) => {
        // console.log("event", JSON.parse(event.data));
        // const parsedData = JSON.parse(event.data);

        // setFacts((facts) => facts.concat(parsedData));
        setFacts(JSON.parse(event.data));
      };

      setListening(true);
      setMsg("");
    }
  }, [listening, facts, msg, name]);

  return (
    <>
    <header className="header">Chat App</header>
      <section className="chat-section">
        <div className="msgArea">
          {facts &&
            facts?.map((fact, id) => (
              <div className="incoming" key={id}>
                <h4>{fact?.username}</h4>
                <p>{fact?.message}</p>
              </div>
            ))}
        </div>
      </section>
      <br /> <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="username"
          className="username"
          type="text"
          required
          {...register("username")}
          placeholder="Enter your name"
          disabled={name}
        />
        <div style={{ display: "flex" }}>
          <textarea
            type="text"
            required
            name="chat"
            {...register("chat")}
            id="textarea"
            rows="1"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write a message..."
          />
          <button type="submit" className="submitButton">
            Send
          </button>
        </div>
      </form>
    </>
  );
}

export default App;
