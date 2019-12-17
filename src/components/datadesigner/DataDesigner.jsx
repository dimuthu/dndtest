import React, { useState } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";
import DataSource from "./datasource/DataSource";
import update from "immutability-helper";
import data from "../../mockdata/data.json";

import "./DataDesigner.css";

const DataDesigner = () => {
  let leftOffset = -150;
  const [sources, setSources] = useState(
    data.dataSources.map(source => ({
      ...source,
      top: 200,
      left: (leftOffset += 220)
    }))
  );

  const [relationships, setRelationships] = useState([]);

  const [, drop] = useDrop({
    accept: ItemTypes.DATA_SOURCE,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveBox(item.id, left, top);
      return undefined;
    }
  });

  const moveBox = (id, left, top) => {
    setSources(
      update(sources, {
        [id]: {
          $merge: { left, top }
        }
      })
    );
  };

  const setRelationship = (inItem, outItem) => {
    setRelationships([...relationships, { inItem, outItem }]);
  };

  return (
    <div className="data-designer" ref={drop}>
      {Object.keys(sources).map(key => {
        const { id, left, top, name, dataFields } = sources[key];
        return (
          <DataSource
            key={key}
            id={key}
            uid={id}
            left={left}
            top={top}
            hideSourceOnDrag={true}
            name={name}
            dataFields={dataFields}
            setRelationship={setRelationship}
          />
        );
      })}
    </div>
  );
};

export default DataDesigner;
