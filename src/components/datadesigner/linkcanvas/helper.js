import * as _ from "lodash";
import PF from "pathfinding";

export const getPathCords = (items, container) => {
  return getRelationshipCords(items, container.current);
};

const getRelationshipCords = (items, container) => {
  const scrollPos = getScrollPosition();
  const containerPos = getOffset(container, scrollPos);
  const relationshipCords = [];
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
      relationshipCords.push(getAnchorPoints(inItemPos, outItemPos));
    }
  });
  console.log(generateMatrix(containerPos.width, containerPos.height));
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
        top: element1.top + element1.height / 2,
        left: element1.left + element1.width
      },
      { top: element2.top + element2.height / 2, left: element2.left }
    ];
  }
  return [
    {
      top: element1.top + element1.height / 2,
      left: element1.left
    },
    {
      top: element2.top + element2.height / 2,
      left: element2.left + element2.width
    }
  ];
};

const generateMatrix = (width, height) => {
  var matrix = getEmptyMatrix([width, height]);
  return matrix;
};

const getEmptyMatrix = dimensions => {
  var array = [];

  for (var i = 0; i < dimensions[0]; ++i) {
    array.push(
      dimensions.length === 1 ? 0 : getEmptyMatrix(dimensions.slice(1))
    );
  }

  return array;
};
