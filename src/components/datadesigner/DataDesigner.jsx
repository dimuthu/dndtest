import React, { useState, useRef } from "react";
import Canvas from "./canvas/Canvas";
import LinkCanvas from "./linkcanvas/LinkCanvas";
import data from "../../mockdata/data.json";

import "./DataDesigner.css";

const DataDesigner = () => {
  const containerRef = useRef(null);
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
  return (
    <div ref={containerRef} className="data-designer">
      <LinkCanvas
        sources={sources}
        relationships={relationships}
        container={containerRef}
      />
      <Canvas
        sources={sources}
        setSources={setSources}
        setRelationship={setRelationship}
      />
    </div>
  );
};

export default DataDesigner;
