import React, { useState, useEffect } from "react";
import Path from "paths-js/path";
import * as _ from "lodash";
import { getPathCords, SCALING_FACTOR } from "./helper";

const LinkCanvas = ({
  sources,
  relationships,
  setRelationships,
  container
}) => {
  const [paths, setPaths] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  useEffect(() => {
    const drawRelationships = () => {
      const pathCords = getPathCords(relationships, container);
      const pathList = [];
      let key = 0;
      _.each(pathCords, pathCord => {
        if (pathCord.length > 1) {
          let path = Path().moveto(
            pathCord[0][0] * SCALING_FACTOR,
            pathCord[0][1] * SCALING_FACTOR
          );
          for (let i = 1; i < pathCord.length; i++) {
            path = path.lineto(
              pathCord[i][0] * SCALING_FACTOR,
              pathCord[i][1] * SCALING_FACTOR
            );
          }
          pathList.push({ id: key++, path: path.print() });
        }
      });
      setPaths(pathList);
    };
    setTimeout(() => {
      drawRelationships();
    }, 100);
  }, [sources, relationships, container]);

  const linkClickEventHandler = pathId => {
    console.log(selectedLink, pathId);
    if (selectedLink === pathId) {
      setSelectedLink(null);
    } else {
      setSelectedLink(pathId);
    }
  };

  const keyDownEventHandler = e => {
    if (e.keyCode === 8 || e.keyCode === 46) {
      const rels = [...relationships];
      rels.splice(selectedLink, 1);
      setSelectedLink(null);
      setRelationships(rels);
    }
  };

  return (
    <svg
      className="link-canvas"
      width="100%"
      height="100%"
      onKeyDown={keyDownEventHandler}
      tabIndex="0"
    >
      {paths &&
        paths.map(path => (
          <path
            key={path.id}
            d={path.path}
            fillOpacity="0.0"
            stroke="black"
            className={path.id === selectedLink ? "selected" : ""}
            onClick={() => linkClickEventHandler(path.id)}
          />
        ))}
    </svg>
  );
};

export default LinkCanvas;
