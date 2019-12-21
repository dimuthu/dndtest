import * as _ from "lodash";
import PF from "pathfinding";
export const SCALING_FACTOR = 5;

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
      let finder = new PF.JumpPointFinder({
        heuristic: PF.Heuristic.manhattan,
        diagonalMovement: PF.DiagonalMovement.Never
      });
      const anchorPoints = getAnchorPoints(inItemPos, outItemPos);
      let path = finder.findPath(
        Math.floor(anchorPoints[0].left / SCALING_FACTOR),
        Math.floor(anchorPoints[0].top / SCALING_FACTOR),
        Math.floor(anchorPoints[1].left / SCALING_FACTOR),
        Math.floor(anchorPoints[1].top / SCALING_FACTOR),
        grid
      );
      path = PF.Util.compressPath(path);
      path = [
        [
          Math.floor(anchorPoints[0].origLeft / SCALING_FACTOR),
          Math.floor(anchorPoints[0].top / SCALING_FACTOR)
        ],
        ...path,
        [
          Math.floor(anchorPoints[1].origLeft / SCALING_FACTOR),
          Math.floor(anchorPoints[1].top / SCALING_FACTOR)
        ]
      ];
      relationshipCords.push(path);
    }
  });
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
        top: element1.top + Math.floor(element1.height / 2),
        left: element1.left + element1.width + 20,
        origLeft: element1.left + element1.width + 5
      },
      {
        top: element2.top + Math.floor(element2.height / 2),
        left: element2.left - 20,
        origLeft: element2.left - 5
      }
    ];
  }
  return [
    {
      top: element1.top + Math.floor(element1.height / 2),
      left: element1.left - 20,
      origLeft: element1.left - 5
    },
    {
      top: element2.top + Math.floor(element2.height / 2),
      left: element2.left + element2.width + 20,
      origLeft: element2.left + element2.width + 5
    }
  ];
};

const generateMatrix = (width, height, blockedRegions) => {
  let matrix = getEmptyMatrix(
    Math.floor(width / SCALING_FACTOR),
    Math.floor(height / SCALING_FACTOR)
  );
  _.each(blockedRegions, region => {
    for (
      let i = Math.floor(region.left / SCALING_FACTOR);
      i <= Math.floor(region.right / SCALING_FACTOR);
      i++
    ) {
      for (
        let j = Math.floor(region.top / SCALING_FACTOR);
        j <= Math.floor(region.bottom / SCALING_FACTOR);
        j++
      ) {
        if (matrix[j] !== undefined && matrix[j][i] !== undefined)
          matrix[j][i] = 1;
        else console.log(i, j);
      }
    }
  });
  return matrix;
};

const getEmptyMatrix = (width, height) => {
  let array = [];

  let rowArray = [];
  for (let row = 0; row < height; row++) {
    rowArray = [];
    for (let col = 0; col < width; col++) {
      rowArray.push(0);
    }
    array.push(rowArray);
  }

  return array;
};

const getBlockedRegions = (elements, scrollPosition, containerPos) => {
  const regions = [];
  if (elements.length > 0) {
    _.each(elements, element => {
      const elOffset = getOffset(element, scrollPosition);
      const elPos = getRelativePosition(elOffset, containerPos);
      regions.push({
        top: elPos.top,
        right: elPos.left + elPos.width,
        bottom: elPos.top + elPos.height,
        left: elPos.left
      });
    });
    return regions;
  }
  return [];
};
