import uuid from 'uuid';
import {
  IComment,
} from './types';

export const commentNormalize = (comments: Array<IComment>) => {
  const result = {
    red: [],
    yellow: [],
    green: [],
    blue: [],
  };
  comments.forEach((comment) => {
    result[comment.Color].push({
      _id: comment._id,
      start: comment.TimeRange.start,
      end: comment.TimeRange.end,
      Text: comment.Text,
      Parent: comment.Parent,
      Replies: comment.Replies,
      //Replies: [],
    });
  });
  return result;
};

export const updateCommentStateWithReplyAndText = (oldComments, newComment) => {
  function isSameParentId(element){
    return element._id === newComment.Parent;
  }
  function isSameId(element){
    return element._id === newComment.uuid;
  }


  const parentIndex = oldComments.findIndex(isSameParentId);

  if ( parentIndex !== -1){
    if(!oldComments[parentIndex].Replies){
      oldComments[parentIndex].Replies = [];
    }
    //oldComments[parentIndex].Replies.push(newComment.uuid);
    //Below works if you change the IComment.ts aswell
    oldComments[parentIndex].Replies.push(newComment);
  }


  const targetIndex = oldComments.findIndex(isSameId);

  if ( targetIndex !== -1){
    //oldComments[targetIndex].Text = newComment.Text;
    oldComments.splice(targetIndex,1);
  }


  return [oldComments, oldComments[parentIndex]];
}

export const updateCommentStateWithText = (oldComments, newComment) => {
  function isSameId(element){
    return element._id === newComment.uuid;
  }

  const targetIndex = oldComments.findIndex(isSameId);

  if ( targetIndex !== -1){
    oldComments[targetIndex].Text = newComment.Text;
  }

  return oldComments;
};


export const updateCommentStateWithCommentRemove = (oldComments, newComment) => {
  function isSameId(element){
    return element._id === newComment.uuid;
  }

  const targetIndex = oldComments.findIndex(isSameId);

  if ( targetIndex !== -1){
    oldComments.splice(targetIndex, 1);
  }

  return oldComments;
};


export const commentGenerateRemoveDiff = (newComments,idOfDeleted, preComments, color) => {
  const commentUpdate = {
    remove: [],
    create: [],
    edit:   [],
  };
  /*const preUUID = new Set(preComments.map((comment) => {
    return comment._id;
  }));*/
  const preUUID = new Set();
  if(idOfDeleted){
    preUUID.add(idOfDeleted);
  }
  
  commentUpdate.remove = Array.from(preUUID);
  return [idOfDeleted, commentUpdate];
};


export const commentGenerateDiff = (newComments, preComments, color) => {
  const commentUpdate = {
    remove: [],
    create: [],
    edit:   [],
  };
  const preUUID = new Set(preComments.map((comment) => {
    return comment._id;
  }));
  newComments.forEach((comment) => {
    if (!comment._id) {
      comment._id = uuid.v4();
      commentUpdate.create.push({
        _id: comment._id,
        TimeRange: {
          start: comment.start,
          end: comment.end,
        },
        Color: color,
        Text: comment.Text,
      });
    }
    preUUID.delete(comment._id);
  });
  commentUpdate.remove = Array.from(preUUID);
  return [newComments, commentUpdate];
};

export const commentRemoveSingleColor = (preComments, newInterval) => {
  const newComments = [...preComments];
  const startTime = newInterval.start;
  const endTime = newInterval.end;

  for (let j = 0; j < newComments.length; j += 1) {
    if (endTime < newComments[j].start || startTime > newComments[j].end) {
      // Do nothing
    } else if (startTime < newComments[j].start && startTime < newComments[j].end && endTime >= newComments[j].start && endTime < newComments[j].end) {
      newComments[j] = {
        start: endTime,
        end: newComments[j].end,
      };
    } else if (startTime >= newComments[j].start && startTime < newComments[j].end && endTime > newComments[j].start && endTime <= newComments[j].end) {
      newComments.push({ start: endTime, end: newComments[j].end });
      newComments[j] = {
        start: newComments[j].start,
        end: startTime,
      };
    } else if (startTime > newComments[j].start && startTime < newComments[j].end && endTime >= newComments[j].start && endTime >= newComments[j].end) {
      newComments[j] = {
        start: newComments[j].start,
        end: startTime,
      };
    } else if (startTime <= newComments[j].start && startTime <= newComments[j].end && endTime >= newComments[j].start && endTime >= newComments[j].end) {
      newComments.splice(j, 1);
      j -= 1;
    }
  }
  newComments.sort((a, b) => {
    return (a.start - b.start);
  });
  return newComments;
};

export const commentRemoveAllColor = (preComments, newInterval) => {
  const newComments = {
    red: [],
    yellow: [],
    green: [],
    blue: [],
    purple: [],
  };
  for (const color in preComments) {
    newComments[color] = commentRemoveSingleColor(preComments[color], newInterval);
  }
  return newComments;
};