import React, { useState, useEffect } from "react";
import Path from "paths-js/path";
import * as _ from "lodash";
import { getPathCords } from "./helper";

const LinkCanvas = ({ sources, relationships, container }) => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const drawRelationships = () => {
      const pathCords = getPathCords(relationships, container);
      const pathList = [];
      let key = 0;
      _.each(pathCords, pathCord => {
        let path = Path()
          .moveto(pathCord[0].left, pathCord[0].top)
          .lineto(pathCord[1].left, pathCord[1].top);
        pathList.push({ id: key++, path: path.print() });
      });
      setPaths(pathList);
    };
    drawRelationships();
  }, [sources, relationships, container]);

  return (
    <svg className="link-canvas" width="100%" height="100%">
      {paths &&
        paths.map(path => (
          <path key={path.id} d={path.path} fillOpacity="0.0" stroke="black" />
        ))}
    </svg>
  );
};

export default LinkCanvas;
