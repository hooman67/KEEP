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
      for (const commentData of req.body.Comments) {
        console.log('hs DelCom req.body.Comments: ', req.body.Comments);
        if(commentData.Parent){
          console.log('hs deleteCommentReply sawReply data:\n', commentData);
          userLessonQueryResult.Comments.forEach(function(comment){
            if(comment._id === commentData.Parent){
              console.log('hs deleteCommentReply found parent: ',
                comment._id, 'for child: ', commentData.Parent);
                function isSameId(element){
                  return element._id === commentData.uuid;
                }
                const replyIndex = comment.Replies.findIndex(isSameId);
                if(replyIndex !== -1 ){
                  comment.Replies.splice(replyIndex,1);
                }else{
                  console.log('hs deleteRep Server Error: Could not find this reply in the parents list');
                }
            }
          });
        }else {
          if (commentData.uuid && userLessonQueryCommentsID.includes(commentData.uuid)) {
            userLessonQueryResult.Comments.pull(commentData.uuid);
            console.log('hs DelCom removed: ', commentData.Text);
          } else {
            throw new Error();
          }
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
          commentData.PreviousText = commentData.Text;
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


export const editComments = async (req, res) => {
  console.log('hs editComments controller called\n');
  
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;

  if (req.body.Comments) {
    
    try { 
      for (const commentData of req.body.Comments) {
        
        console.log('hs EditComent req.body.Comments: ', req.body.Comments);
        if(commentData.Parent){
          
          console.log('hs EditComentReply sawReply data:\n', commentData);
          userLessonQueryResult.Comments.forEach(function(comment){
            
            if(comment._id === commentData.Parent){
              
              console.log('hs EditComentReply found parent: ',
              commentData.Parent, 'for child: ', commentData._id);
              
              function isSameId(element){
                return element._id === commentData._id;
              }

              const replyIndex = comment.Replies.findIndex(isSameId);
    
              if(replyIndex !== -1 ){
                console.log('hs EditComentReply found the reply. OldText: ',
                    comment.Replies[replyIndex].Text, ' NewText: ', commentData.Text);

                    //comment.Replies[replyIndex].Text = commentData.Text;
                    //comment.Replies.splice(replyIndex,1);
                    //comment.Replies.push(commentData);
                    //comment.Replies[replyIndex] = commentData;
                    comment.Replies.splice(replyIndex, 1, commentData);
              }else{
                console.log('hs EditComentReply Server Error: Could not find this reply in the parents list');
              }
            }
          });
        }else {
          console.log('hs EditComent sawComment data:\n', commentData);
          userLessonQueryResult.Comments.forEach(function(comment){
            if(comment._id === commentData._id){
              comment.Text = commentData.Text;
            }
          });
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


/*export const editComments = async (req, res) => {
  console.log('hs editComments controller called\n');
  const  userLessonQueryResult: IUserLessonSchema = req.middleware.userLessonQueryResult;
  const userLessonQueryCommentsID = userLessonQueryResult.Comments.map((comment) => {
    return comment._id;
  });
  if (req.body.Comments) {
    console.log('hsDebServ conrollers/Comments.ts ln82(editComments) req.body.comments:\n', req.body.Comments);
    try {
      for (const commentData of req.body.Comments) {
        if(commentData.Parent){
          console.log("hs pushing to server editComment CHILD");
          if (userLessonQueryCommentsID.includes(commentData.Parent)) {
            console.log('hs userLessonQueryResult.Comments:\n',userLessonQueryCommentsID.findIndex(commentData.Parent));
          } else {
            throw new Error();
          }
        }else{
          if (commentData._id) {
     
            if (userLessonQueryCommentsID.includes(commentData._id)) {
              console.log("hs pushing to server editComment parent");
              userLessonQueryResult.Comments.pull(commentData._id);
            } else {
              throw new Error();
            }
          } else {
            throw new Error();
          }
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
};*/

