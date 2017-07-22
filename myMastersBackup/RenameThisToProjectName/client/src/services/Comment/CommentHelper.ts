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
    const replyIndex = oldComments[parentIndex].Replies.findIndex(isSameId);
    if(replyIndex !== -1 ){
      oldComments[parentIndex].Replies[replyIndex].Text = newComment.Text;
    }else{
      console.log('hs Error: Could not find this reply in the parents list');
    }
  }else{
    console.log('hs Error: Could not find the parent of this reply');
  }

  return [oldComments, oldComments[parentIndex]];
}

export const updateCommentStateWithReply = (oldComments, newComment) => {
  function isSameParentId(element){
    return element._id === newComment.Parent;
  }

  if (!newComment._id) {
    newComment._id = uuid.v4();
  }

  const parentIndex = oldComments.findIndex(isSameParentId);

  if ( parentIndex !== -1){
    
    if(!oldComments[parentIndex].Replies){
      oldComments[parentIndex].Replies = [];
    }

    oldComments[parentIndex].Replies.push(newComment);
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
  function isSameParentId(element){
    return element._id === newComment.Parent;
  }

  if(newComment.Parent){

    const parentIndex = oldComments.findIndex(isSameParentId);

    if ( parentIndex !== -1){
      const replyIndex = oldComments[parentIndex].Replies.findIndex(isSameId);
      if(replyIndex !== -1 ){
        oldComments[parentIndex].Replies.splice(replyIndex,1);
      }else{
        console.log('hs Error: Could not find this reply in the parents list');
      }
    }else{
      console.log('hs Error: Could not find the parent of this reply');
    }

  }else{
    const targetIndex = oldComments.findIndex(isSameId);

    if ( targetIndex !== -1){
      oldComments.splice(targetIndex, 1);
    }
  }

  return oldComments;
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