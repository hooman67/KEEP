import uuid from 'uuid';
import {
  IHighlight,
} from './types';

export const highlightNormalize = (highlights: Array<IHighlight>) => {
  const result = {
    red: [],
    yellow: [],
    green: [],
    blue: [],
    purple: [],
  };
  highlights.forEach((highlight) => {
    result[highlight.Color].push({
      _id: highlight._id,
      start: highlight.TimeRange.start,
      end: highlight.TimeRange.end,
    });
  });
  return result;
};

export const highlightMergeIntervals = (newHighlights) => {
  let result = [];
  newHighlights.sort((a, b) => {
    return (a.start - b.start);
  });
  result = [...result, newHighlights[0]];
  for (const highlight of newHighlights) {
    const top = result[result.length - 1];
    if (top.end < highlight.start) {
      result = [...result, highlight];
    } else if (top.end < highlight.end) {
      result.pop();
      result.push({ start: top.start, end: highlight.end });
    }
  }
  return result;
};

export const highlightGenerateDiff = (newHighlights, preHighlights, color) => {
  const highlightUpdate = {
    remove: [],
    create: [],
  };
  const preUUID = new Set(preHighlights.map((highlight) => {
    return highlight._id;
  }));
  newHighlights.forEach((highlight) => {
    if (!highlight._id) {
      highlight._id = uuid.v4();
      highlightUpdate.create.push({
        _id: highlight._id,
        TimeRange: {
          start: highlight.start,
          end: highlight.end,
        },
        Color: color,
      });
    }
    preUUID.delete(highlight._id);
  });
  highlightUpdate.remove = Array.from(preUUID);
  return [newHighlights, highlightUpdate];
};

export const highlightRemoveSingleColor = (preHighlights, newInterval) => {
  const newHighlights = [...preHighlights];
  const startTime = newInterval.start;
  const endTime = newInterval.end;

  for (let j = 0; j < newHighlights.length; j += 1) {
    if (endTime < newHighlights[j].start || startTime > newHighlights[j].end) {
      // Do nothing
    } else if (startTime < newHighlights[j].start && startTime < newHighlights[j].end && endTime >= newHighlights[j].start && endTime < newHighlights[j].end) {
      newHighlights[j] = {
        start: endTime,
        end: newHighlights[j].end,
      };
    } else if (startTime >= newHighlights[j].start && startTime < newHighlights[j].end && endTime > newHighlights[j].start && endTime <= newHighlights[j].end) {
      newHighlights.push({ start: endTime, end: newHighlights[j].end });
      newHighlights[j] = {
        start: newHighlights[j].start,
        end: startTime,
      };
    } else if (startTime > newHighlights[j].start && startTime < newHighlights[j].end && endTime >= newHighlights[j].start && endTime >= newHighlights[j].end) {
      newHighlights[j] = {
        start: newHighlights[j].start,
        end: startTime,
      };
    } else if (startTime <= newHighlights[j].start && startTime <= newHighlights[j].end && endTime >= newHighlights[j].start && endTime >= newHighlights[j].end) {
      newHighlights.splice(j, 1);
      j -= 1;
    }
  }
  newHighlights.sort((a, b) => {
    return (a.start - b.start);
  });
  return newHighlights;
};

export const highlightRemoveAllColor = (preHighlights, newInterval) => {
  const newHighlights = {
    red: [],
    yellow: [],
    green: [],
    blue: [],
    purple: [],
  };
  for (const color in preHighlights) {
    newHighlights[color] = highlightRemoveSingleColor(preHighlights[color], newInterval);
  }
  return newHighlights;
};
