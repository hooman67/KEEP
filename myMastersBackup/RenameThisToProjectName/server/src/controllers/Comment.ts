import { sendJSONResponse } from '../utils';
import { IUserLessonSchema } from '../types';

export const getComments = async (req, res) => {
  console.log('hs getComments controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const commentQueryResult = userLessonQueryResult.Comments;
  console.log('hs:\n', commentQueryResult)
  sendJSONResponse(res, 200, commentQueryResult);
};

export const deleteComments = async (req, res) => {
  console.log('hs deleteComments controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const userLessonQueryCommentsID = userLessonQueryResult.Comments.map((comment) => {
    return comment._id;
  });
  if (req.body.Comments) {
    try {
      for (const id of req.body.Comments) {
        if (userLessonQueryCommentsID.includes(id)) {
          userLessonQueryResult.Comments.pull(id);
        } else {
          throw new Error();
        }
      }
      await userLessonQueryResult.save();
      sendJSONResponse(res, 200, {
        message: 'Action Complete',
      });
    } catch (e) {
      sendJSONResponse(res, 500, {
        message: 'Internal Server Error',
      });
    }
  } else {
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  }
};

export const postComments = async (req, res) => {
  console.log('hs postComments controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  if (req.body.Comments) {
    console.log('hsDebServ conrollers/Comments.ts postComments req.body.comments:\n', req.body.Comments);
    try {
      for (const commentData of req.body.Comments) {
        if (commentData._id) {
          console.log("SS pushing to server");
          console.log("hs query.comments:\n", userLessonQueryResult.Comments)
          if(commentData.Parent){
            console.log('hs postComment sawReply data:\n', commentData);
            userLessonQueryResult.Comments.forEach(function(comment){
              if(comment._id === commentData.Parent){
                console.log('hs postReply found parent: ',
                  comment._id, 'for child: ', commentData.Parent);
                comment.Replies.push(commentData);
              }
            });
          }else{
            console.log('hs postComment sawMaingComment data:\n', commentData)
            userLessonQueryResult.Comments.push(commentData);
          }
        } else {
          throw new Error();
        }
      }
      userLessonQueryResult.Comments.sort((a, b) => {
        return (a.TimeRange.start - b.TimeRange.start);
      });
      await userLessonQueryResult.save();
      sendJSONResponse(res, 200, {
        message: 'Action Complete',
      });
    } catch (e) {
      console.log("hs:",e);
      sendJSONResponse(res, 500, {
        message: 'Internal Server Error',
      });
    }
  } else {
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  }
};


export const replyComments = async (req, res) => {
  console.log('hs replyComments controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  if (req.body.Comments) {
    console.log('hsDebServ conrollers/Comments.ts replyComments req.body.comments:\n', req.body.Comments);
    try {
      for (const commentData of req.body.Comments) {
        if (commentData._id) {
          console.log("SS pushing to server reply");
          console.log("hs query.comments reply:\n", userLessonQueryResult.Comments)
          //userLessonQueryResult.Comments.push(commentData);
        } else {
          throw new Error();
        }
      }
      userLessonQueryResult.Comments.sort((a, b) => {
        return (a.TimeRange.start - b.TimeRange.start);
      });
      await userLessonQueryResult.save();
      sendJSONResponse(res, 200, {
        message: 'Action Complete',
      });
    } catch (e) {
      console.log("hs:",e);
      sendJSONResponse(res, 500, {
        message: 'Internal Server Error',
      });
    }
  } else {
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  }
};


export const editComments = async (req, res) => {
  console.log('hs editComments controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
    const userLessonQueryCommentsID = userLessonQueryResult.Comments.map((comment) => {
    return comment._id;
  });
  if (req.body.Comments) {
    console.log('hsDebServ conrollers/Comments.ts ln82(editComments) req.body.comments:\n', req.body.Comments);
    try {
      for (const commentData of req.body.Comments) {
        if (commentData._id) {
          /*console.log("SS pushing to server editComment");
          console.log("hs (editComments) query.comments:\n", userLessonQueryResult.Comments)
          userLessonQueryResult.Comments.set(commentData);*/
          if (userLessonQueryCommentsID.includes(commentData._id)) {
            userLessonQueryResult.Comments.pull(commentData._id);
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      }
      userLessonQueryResult.Comments.sort((a, b) => {
        return (a.TimeRange.start - b.TimeRange.start);
      });
      await userLessonQueryResult.save();
      sendJSONResponse(res, 200, {
        message: 'Action Complete',
      });
    } catch (e) {
      console.log("hs:",e);
      sendJSONResponse(res, 500, {
        message: 'Internal Server Error',
      });
    }
  } else {
    sendJSONResponse(res, 200, {
      message: 'Action Complete',
    });
  }
};

