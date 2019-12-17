import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import DataDesigner from "../datadesigner/DataDesigner";

import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-sm">
              <DataDesigner />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
