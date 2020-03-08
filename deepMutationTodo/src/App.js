import React from "react";
import "./styles.css";

import TodosList from "./components/TodosList";

export default function App() {
  return (
    <div className="App">
      <h1>Hello deep-mutatuon Todo example</h1>
      <TodosList />
    </div>
  );
}
