import ReactDOM from "react-dom";
import * as _ from "lodash";

export const getPathCords = (item, container) => {
  getRelationshipCords(item, container);
};

const getRelationshipCords = (items, container) => {
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const containerRect = container.current.getBoundingClientRect();
  const containerPosition = {
    top: containerRect.top + scrollTop,
    left: containerRect.left + scrollLeft
  };

  _.each(items, item => {
    const inItemRect = item.inItem.ref.getBoundingClientRect();
    const inItemPosition = {
      name: item.inItem.id,
      top: inItemRect.top + scrollTop,
      left: inItemRect.left + scrollLeft
    };
    const outItemRect = item.outItem.ref.getBoundingClientRect();
    const outItemPosition = {
      name: item.outItem.id,
      top: outItemRect.top + scrollTop,
      left: outItemRect.left + scrollLeft
    };
    console.log(inItemPosition);
    console.log(outItemPosition);
  });
};
