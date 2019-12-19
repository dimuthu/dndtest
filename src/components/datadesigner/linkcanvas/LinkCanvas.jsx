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
        if(pathCord.length > 1){
          let path = Path().moveto(pathCord[0][0], pathCord[0][1]);
          for (let i = 1; i < pathCord.length; i++) {
            path = path.lineto(pathCord[i][0], pathCord[i][1]);
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
