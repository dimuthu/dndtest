import React, { useEffect } from "react";
import Path from "paths-js/path";
import * as _ from "lodash";
import { getPathCords } from "./helper";

const LinkCanvas = ({ sources, relationships }) => {
  var path = Path()
    .moveto(10, 20)
    .lineto(60, 70)
    .lineto(75, 205);

  useEffect(() => {
    const drawRelationships = () => {
      _.each(relationships, item => {
        getPathCords(item);
      });
    };

    drawRelationships();
  }, [sources, relationships]);

  return (
    <svg className="link-canvas" width="100%" height="100%">
      <path d={path.print()} fillOpacity="0.0" stroke="black" />
    </svg>
  );
};

export default LinkCanvas;
