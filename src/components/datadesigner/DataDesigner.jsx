import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Canvas from "./canvas/Canvas";
import LinkCanvas from "./linkcanvas/LinkCanvas";
import data from "../../mockdata/data.json";

import "./DataDesigner.css";

const DataDesigner = () => {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  let leftOffset = -150;
  const [sources, setSources] = useState(
    data.dataSources.map(source => ({
      ...source,
      top: 200,
      left: (leftOffset += 220)
    }))
  );

  const [relationships, setRelationships] = useState([]);

  const setRelationship = (inItem, outItem) => {
    setRelationships([...relationships, { inItem, outItem }]);
  };

  const saveAndExport = () => {
    //here we can send relationship to serverside via ajax
    fetch("https://server.com/relationships", {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify(relationships)
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

    // here is the image export function but it's difficult to find bullet proof method
    // that runs successfully in client-side
    html2canvas(containerRef.current, {
      windowWidth: 1110,
      windowHeight: 800,
      x: 100,
      backgroundColor: "#e7e7e7",
      ignoreElements: element => {
        if (element === buttonRef.current) return true;
      }
    }).then(canvas => {
      canvas.toBlob(blob => {
        saveAs(blob, "export.png");
      });
    });
  };

  return (
    <div ref={containerRef} className="data-designer">
      <div className="button-wrapper">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => saveAndExport()}
          ref={buttonRef}
        >
          Save
        </button>
      </div>
      <Canvas
        sources={sources}
        setSources={setSources}
        setRelationship={setRelationship}
      />
      <LinkCanvas
        sources={sources}
        relationships={relationships}
        container={containerRef}
        setRelationships={setRelationships}
      />
    </div>
  );
};

export default DataDesigner;
