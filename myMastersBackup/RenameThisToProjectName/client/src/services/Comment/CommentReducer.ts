import * as actions from './ActionTypes';
import {
  commentNormalize,
  commentGenerateDiff,
  updateCommentStateWithText,
  updateCommentStateWithReplyAndText,
  updateCommentStateWithCommentRemove,
  commentGenerateRemoveDiff,
  commentRemoveSingleColor,
  commentRemoveAllColor,
} from './CommentHelper';

const INITIAL_STATE = {
  commentData: null,
  cachedCommentData: null,
  removeMultiColorComments: false,
  removeComment: false,
  activeCommentColor: null,
  // communicate with database
  commentUpdate: {
    remove: null,
    create: null,
    edit:   null,
  },
  selectSection: {
    selectSectionStartTime: null,
    selectSectionEndTime: null,
    status: 'free',
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.COMMENT_INIT:
      return {
        ...state,
        commentData: commentNormalize(action.Comments),
      };

    case actions.COMMENT_UPDATE:
      return {
        ...state,
        commentUpdate: {
          remove: null,
          create: null,
          edit:   null,
        },
      };

    case actions.COMMENT_SELECT_COLOR:
      return {
        ...state,
        activeCommentColor: action.color,
      };

    case actions.COMMENT_DELETE_TEXT:
     const deleteTextUpdatedComments = updateCommentStateWithCommentRemove([...state.commentData[state.activeCommentColor]], {
        uuid: action.uuid,
        start: action.startTime,
        end: action.endTime,
        Text: action.Text,
      });

      const [idOfSelectedDelete, commentUpdateDeleteText] = commentGenerateRemoveDiff(deleteTextUpdatedComments, action.uuid, state.commentData[state.activeCommentColor], state.activeCommentColor);

      return {
        ...state,
        commentData: {
          ...state.commentData,
          [state.activeCommentColor]: deleteTextUpdatedComments,
        },
        commentUpdate: commentUpdateDeleteText,
      };


    case actions.COMMENT_EDIT_TEXT:
       const editTextUpdatedComments = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
          uuid: action.uuid,
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
        });


        const editTextCommentUpdate = {
          remove: [],
          create: [],
          edit:   [],
        };

        editTextCommentUpdate.edit.push({
          _id: action.uuid,
          TimeRange: {
            start: action.startTime,
            end: action.endTime,
          },
          Color: state.activeCommentColor,
          Text: action.Text,
        });;

        return {
          ...state,
          commentData: {
            ...state.commentData,
            [state.activeCommentColor]: editTextUpdatedComments,
          },
          commentUpdate: editTextCommentUpdate,
        };



    case actions.COMMENT_SEND_TEXT:
        const commentUpdateSendText = {
          remove: [],
          create: [],
          edit:   [],
        };


        if(action.Parent){
          console.log('hs updating parent: ', action.Parent, ' for child: ', action.uuid);
          
          const [sendTextUpdatedComments, parentComment] = updateCommentStateWithReplyAndText([...state.commentData[state.activeCommentColor]], {
            uuid: action.uuid,
            start: action.startTime,
            end: action.endTime,
            Text: action.Text,
            Parent: action.Parent,
          });

          //HS add the comment to comments
          commentUpdateSendText.create.push({
            _id: action.uuid,
            TimeRange: {
              start: action.startTime,
              end: action.endTime,
            },
            Color: state.activeCommentColor,
            Text: action.Text,
            Parent: action.Parent,
          });

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: sendTextUpdatedComments,
            },
            commentUpdate: commentUpdateSendText,
          };

        }else{
          const sendTextUpdatedComments = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
            uuid: action.uuid,
            start: action.startTime,
            end: action.endTime,
            Text: action.Text,
            Parent: action.Parent,
          });

          //HS add the comment
          commentUpdateSendText.create.push({
            _id: action.uuid,
            TimeRange: {
              start: action.startTime,
              end: action.endTime,
            },
            Color: state.activeCommentColor,
            Text: action.Text,
            Parent: action.Parent,
          });

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: sendTextUpdatedComments,
            },
            commentUpdate: commentUpdateSendText,
          };
        }





    // TODO: Clean Up Code
    case actions.COMMENT_SEND_SELECTION:
      const selectSection = {
        selectSectionStartTime: action.startTime,
        selectSectionEndTime: action.endTime,
        status: 'end',
      };
      if (state.removeMultiColorComments) {
        const newComments = commentRemoveAllColor(state.commentData, {
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
        });
        const newCommentsUUID = {};
        const commentUpdate = {
          remove: [],
          create: [],
          edit:   [],
        };
        Object.keys(newComments).forEach((color) => {
          const [newUUID, newUpdate] = commentGenerateDiff(newComments[color], state.commentData[color], color);
          newCommentsUUID[color] = newUUID;
          if (newUpdate.remove.length !== 0) {
            commentUpdate.remove = [...commentUpdate.remove, ...newUpdate.remove];
          }
          if (newUpdate.create.length !== 0) {
            commentUpdate.create = [...commentUpdate.create, ...newUpdate.create];
          }
        });
        return {
          ...state,
          commentData: newComments,
          commentUpdate,
          selectSection,
        };
      }
      if (state.activeCommentColor) {
        if (state.removeComment) {
          const removedComments = commentRemoveSingleColor([...state.commentData[state.activeCommentColor]], {
            start: action.startTime,
            end: action.endTime,
          });
          const [commentsWithUUID, commentUpdate] = commentGenerateDiff(removedComments, state.commentData[state.activeCommentColor], state.activeCommentColor);
          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: commentsWithUUID,
            },
            commentUpdate,
            selectSection,
          };
        } else if (!state.removeComment) {
          /*const mergedComment = commentMergeIntervals([...state.commentData[state.activeCommentColor], {
            start: action.startTime,
            end: action.endTime,
          }]);*/
          const mergedComment = [...state.commentData[state.activeCommentColor], {
            start: action.startTime,
            end: action.endTime,
            Text: action.Text,
            Parent: action.Parent,
          }];
          const [commentsWithUUID, commentUpdate] = commentGenerateDiff(mergedComment, state.commentData[state.activeCommentColor], state.activeCommentColor);
          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: commentsWithUUID,
            },
            commentUpdate:{
              remove: [],
              create: [],
              edit:   [],
            },
            selectSection,
          };
        }
      }
      return {
        ...state,
        selectSection,
      };

    case actions.COMMENT_REMOVE_OFF:
      return {
        ...state,
        removeMultiColorComments: false,
        removeComment: false,
      };

    case actions.COMMENT_REMOVE_MULTIPLE:
      return {
        ...state,
        removeMultiColorComments: true,
        removeComment: false,
      };

    case actions.COMMENT_TOGGLE:
      if (state.commentData) {
        return {
          ...state,
          commentData: null,
          cachedCommentData: state.commentData,
        };
      }
      return {
        ...state,
        commentData: state.cachedCommentData,
        cachedCommentData: null,
      };

    case actions.COMMENT_REMOVE_ENABLE:
      return {
        ...state,
        removeComment: true,
        removeMultiColorComments: false,
      };

    case actions.COMMENT_SELECT_SECTION_START:
      return {
        ...state,
        selectSection: {
          ...state.selectSection,
          selectSectionStartTime: action.selectSectionStartTime,
          selectSectionEndTime: null,
          status: 'start',
        },
      };

    case actions.COMMENT_SELECT_SECTION_IN_PROGRESS:
      return {
        ...state,
        selectSection: {
          ...state.selectSection,
          selectSectionEndTime: action.selectSectionEndTime,
        },
      };

    case actions.COMMENT_SELECT_SECTION_CLEAR:
      return {
        ...state,
        selectSection: {
          ...state.selectSection,
          selectSectionStartTime: null,
          selectSectionEndTime: null,
          status: 'free',
        },
      };

    case actions.COMMENT_HOVER:
      console.log("COMMENT HOVER IN COMMENT REDUCER");
      console.log(state.commentData);
      
      return state;

    default:
      return state;
  }
};