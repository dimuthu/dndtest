import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import ItemTypes from "../ItemTypes";

const DataField = ({ index, id, name, setRelationship, parentId }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.DATA_FIELD,
    drop(item) {
      if (!ref.current) {
        return;
      }

      if (item.parentId === parentId) {
        return;
      }

      if (ref)
        if (item.id === id) {
          return;
        }

      setRelationship(
        { type: ItemTypes.DATA_FIELD, index, id, ref: ref.current, parentId },
        { type: ItemTypes.DATA_FIELD, index, id, ref: item.ref.current, parentId }
      );
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.DATA_FIELD, index, id, ref, parentId },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  drag(drop(ref));

  return (
    <li ref={ref} className="list-group-item">
      {name}
    </li>
  );
};

export default DataField;
