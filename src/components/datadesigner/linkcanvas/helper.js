import * as _ from "lodash";
import PF from "pathfinding";

export const getPathCords = (items, container) => {
  return getRelationshipCords(items, container.current);
};

const getRelationshipCords = (items, container) => {
  const scrollPos = getScrollPosition();
  const containerPos = getOffset(container, scrollPos);
  const relationshipCords = [];
  const dataSources = container.querySelectorAll(".data-source");
  const blockedRegions = getBlockedRegions(
    dataSources,
    scrollPos,
    containerPos
  );
  const matrix = generateMatrix(
    containerPos.width,
    containerPos.height,
    blockedRegions
  );

  _.each(items, item => {
    var inItemMatches = container.querySelectorAll(`.field-${item.inItem.id}`);
    var outItemMatches = container.querySelectorAll(
      `.field-${item.outItem.id}`
    );
    if (inItemMatches.length > 0 && outItemMatches.length > 0) {
      const inItemPos = getRelativePosition(
        getOffset(inItemMatches[0], scrollPos),
        containerPos
      );
      const outItemPos = getRelativePosition(
        getOffset(outItemMatches[0], scrollPos),
        containerPos
      );
      let grid = new PF.Grid(matrix);
      let finder = new PF.BiBestFirstFinder();
      const anchorPoints = getAnchorPoints(inItemPos, outItemPos);
      console.log(anchorPoints);
      let path = finder.findPath(
        anchorPoints[0].left,
        anchorPoints[0].top,
        anchorPoints[1].left,
        anchorPoints[1].top,
        grid
      );
      // let path = finder.findPath(
      //   800,
      //   100,
      //   499,
      //   370,
      //   grid
      // );
      path = PF.Util.compressPath(path);
      relationshipCords.push(path);
    }
  });
  console.log(relationshipCords);
  return relationshipCords;
};

const getScrollPosition = () => {
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: scrollTop, left: scrollLeft };
};

const getOffset = (element, scrollPosition) => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + scrollPosition.top,
    left: rect.left + scrollPosition.left,
    width: rect.width,
    height: rect.height
  };
};

const getRelativePosition = (elementPosition, containerPosition) => {
  return {
    top: elementPosition.top - containerPosition.top,
    left: elementPosition.left - containerPosition.left,
    width: elementPosition.width,
    height: elementPosition.height
  };
};

const getAnchorPoints = (element1, element2) => {
  if (element1.left < element2.left) {
    return [
      {
        top: element1.top + Math.trunc(element1.height / 2),
        left: element1.left + element1.width + 10
      },
      { top: element2.top + Math.trunc(element2.height / 2), left: element2.left - 10 }
    ];
  }
  return [
    {
      top: element1.top + Math.trunc(element1.height / 2),
      left: element1.left - 10
    },
    {
      top: element2.top + Math.trunc(element2.height / 2),
      left: element2.left + element2.width + 10
    }
  ];
};

const generateMatrix = (width, height, blockedRegions) => {
  //console.log(width, height);
  let matrix = getEmptyMatrix(height, width);
  _.each(blockedRegions, region => {
    for(let i = region.left; i <= region.right; i++){
      for(let j = region.top; j <= region.bottom; j++){
        console.log(i, j)
        if (i < width && j < height) matrix[i][j] = 1;
      }
    }
  });
  return matrix;
};

const getEmptyMatrix = (width, height) => {
  let array = [];

  let rowArray = [];
  for (let row = 0; row < width; row++) {
    rowArray = [];
    for (let col = 0; col < height; col++) {
      rowArray.push(0);
    }
    array.push(rowArray);
  }

  return array;
};

const getBlockedRegions = (elements, scrollPosition, containerPos) => {
  const regions = [];
  if(elements.length > 0){
    _.each(elements, element => {
      const elOffset = getOffset(element, scrollPosition);
      const elPos = getRelativePosition(elOffset, containerPos);
      regions.push({top: elPos.top, right: elPos.left + elPos.width, bottom: elPos.top + elPos.height, left: elPos.left});
    });
    return regions;
  }
  return [];
};
