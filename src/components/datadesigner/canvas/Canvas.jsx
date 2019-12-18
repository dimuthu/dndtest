import React from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "../ItemTypes";
import DataSource from "../datasource/DataSource";
import update from "immutability-helper";

const Canvas = ({ sources, setSources, setRelationship }) => {
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

  return (
    <div className="data-designer-canvas" ref={drop}>
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

export default Canvas;
