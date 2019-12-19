import React from "react";
import { useDrag } from "react-dnd";
import ItemTypes from "../ItemTypes";
import DataField from "../datafield/DataField";

const DataSource = ({
  id,
  uid,
  left,
  top,
  hideSourceOnDrag,
  name,
  dataFields,
  setRelationship
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, type: ItemTypes.DATA_SOURCE },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div
      className={`data-source source-${uid}`}
      ref={drag}
      style={{ left, top }}
    >
      <div className="card">
        <div className="card-header">{name}</div>
        <ul className="list-group list-group-flush">
          {Object.keys(dataFields).map(key => {
            const { id, name } = dataFields[key];
            return (
              <DataField
                key={key}
                index={key}
                id={id}
                name={name}
                setRelationship={setRelationship}
                parentId={uid}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DataSource;
