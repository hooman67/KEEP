import * as actions from './ActionTypes';
import {
  commentNormalize,
  commentGenerateDiff,
  updateCommentStateWithText,
  updateCommentStateWithReplyAndText,
  updateCommentStateWithReply,
  updateCommentStateWithCommentRemove,
  updateCommentStateWithHover
} from './CommentHelper';

const INITIAL_STATE = {
  updateComment:false,
  commentData: null,
  colorPickerData: null,
  colorPickerDisplay: false,
  cachedCommentData: null,
  removeMultiColorComments: false,
  removeComment: false,
  activeCommentColor: 'green',
  commentingMode: false,

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

  commentViewMore: false,
  commentViewMoreId: null,
  commentExpandAll: false,

  fdDelayedCommentAction: null,
  fsComCursorPosition: {
    x: 5,
    y: 5,
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
      if(state.fdDelayedCommentAction){
        const mergedCommentFSDelayed = [...state.commentData[action.color], {
          start: state.fdDelayedCommentAction.start,
          end: state.fdDelayedCommentAction.end,
          Color: action.color,
          PreviousText: state.fdDelayedCommentAction.PreviousText,
          Text: state.fdDelayedCommentAction.Text,
          TimeStamp: state.fdDelayedCommentAction.TimeStamp,
          Parent: state.fdDelayedCommentAction.Parent,
          showTimeRange: false,
        }];

        const [commentsWithUUIDFsDelayed, commentUpdateFsDelayed] = commentGenerateDiff(mergedCommentFSDelayed, state.commentData[action.color], action.color);

        const updateColorPickerDataDelayed = commentUpdateFsDelayed.create[0];

        return {
          ...state,
          activeCommentColor: action.color,
          commentData: {
            ...state.commentData,
            [action.color]: commentsWithUUIDFsDelayed,
          },
          fdDelayedCommentAction: null,
          colorPickerData: updateColorPickerDataDelayed,
          colorPickerDisplay: true,
          commentUpdate:{
            remove: [],
            create: [],
            edit:   [],
          },
        };
      }else{
        return{
          ...state,
          activeCommentColor: action.color,
        };
      }

    case actions.COMMENT_MODE_CHANGE:
      return {
        ...state,
        commentingMode: action.mode,
      };

    case actions.COMMENT_DELETE_TEXT:
      const commentToBeDeleted = {
        uuid: action.uuid,
        start: action.startTime,
        end: action.endTime,
        Text: action.Text,
        Parent: action.Parent,
      };

      const deleteTextUpdatedComments = updateCommentStateWithCommentRemove([...state.commentData[state.activeCommentColor]], commentToBeDeleted);

      const commentUpdateDeleteText = {
        remove: [commentToBeDeleted],
        create: [],
        edit:   [],
      };

      return {
        ...state,
        commentData: {
          ...state.commentData,
          [state.activeCommentColor]: deleteTextUpdatedComments,
        },
        commentUpdate: commentUpdateDeleteText,
        colorPickerData: null,
        colorPickerDisplay: false
      };


    case actions.COMMENT_CANCEL_TEXT:

      if(action.Text){
        if(action.Parent){
          console.log('hs updating parent: ', action.Parent, ' for child: ', action.uuid);

          const [cancelTextUpdatedComments, parentComment] = updateCommentStateWithReplyAndText([...state.commentData[state.activeCommentColor]], {
            uuid: action.uuid,
            start: action.startTime,
            end: action.endTime,
            TimeStamp: action.TimeStamp,
            Text: action.Text,
            Parent: action.Parent,
            showTimeRange: false,
          });

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: cancelTextUpdatedComments,
            },
            commentUpdate: {
              remove: [],
              create: [],
              edit:   [],
            },
            colorPickerData: null,
            colorPickerDisplay: false,
          };

        }else{
          const cancelTextUpdatedComments = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
            uuid: action.uuid,
            start: action.startTime,
            end: action.endTime,
            TimeStamp: action.TimeStamp,
            Text: action.Text,
            Parent: action.Parent,
            showTimeRange: false,
          });

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: cancelTextUpdatedComments,
            },
            commentUpdate: {
              remove: [],
              create: [],
              edit:   [],
            },
            colorPickerData: null,
            colorPickerDisplay: false,
          };
        }
      }else{
        const commentToBeCanceled = {
          uuid: action.uuid,
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
          Parent: action.Parent,
        };

        const cancelTextUpdatedComments = updateCommentStateWithCommentRemove([...state.commentData[state.activeCommentColor]], commentToBeCanceled);

        return {
          ...state,
          commentData: {
            ...state.commentData,
            [state.activeCommentColor]: cancelTextUpdatedComments,
          },
          commentUpdate: {
            remove: [],
            create: [],
            edit:   [],
          },
          colorPickerData: null,
          colorPickerDisplay: false
        };
      }

     


    case actions.COMMENT_EDIT_TEXT:
      state.updateComment = true;

      if(action.Parent){
        console.log('hs updating parent: ', action.Parent, ' for child: ', action.uuid);

        const [editTextUpdatedComments, parentComment] = updateCommentStateWithReplyAndText([...state.commentData[state.activeCommentColor]], {
          uuid: action.uuid,
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
          Parent: action.Parent,
        });

        return {
          ...state,
          commentData: {
            ...state.commentData,
            [state.activeCommentColor]: editTextUpdatedComments,
          },
          commentUpdate: {
            remove: [],
            create: [],
            edit:   [],
          },
        };

      }else{
        const editTextUpdatedComments = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
          uuid: action.uuid,
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
          Parent: action.Parent,
        });

        return {
          ...state,
          commentData: {
            ...state.commentData,
            [state.activeCommentColor]: editTextUpdatedComments,
          },
          commentUpdate: {
            remove: [],
            create: [],
            edit:   [],
          },
        };

      }



    case actions.COMMENT_SEND_FIlM_STRIP_TEXT:
        const commentUpdateSendTextFilmStrip = {
          remove: [],
          create: [],
          edit:   [],
        };


        if(action.Parent){
          console.log('hs updating parent: ', action.Parent, ' for child: ', action.uuid);
        }else{
          const sendTextFilmStripUpdatedComments = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
            uuid: action.uuid,
            start: action.startTime,
            end: action.endTime,
            TimeStamp: action.TimeStamp,
            Text: action.Text,
            PreviousText: action.PreviousText,
            Parent: action.Parent,
            showTimeRange: false,
          });

          if(state.updateComment){
            state.updateComment = false;

            commentUpdateSendTextFilmStrip.edit.push({
              _id: action.uuid,
              TimeStamp: action.TimeStamp,
              TimeRange: {
                start: action.startTime,
                end: action.endTime,
              },
              Color: state.activeCommentColor,
              Text: action.Text,
              PreviousText: action.PreviousText,
              Parent: action.Parent,
              showTimeRange: false,
            });

          }else{
            //HS add the comment
            commentUpdateSendTextFilmStrip.create.push({
              _id: action.uuid,
              TimeStamp: action.TimeStamp,
              TimeRange: {
                start: action.startTime,
                end: action.endTime,
              },
              Color: state.activeCommentColor,
              Text: action.Text,
              PreviousText: action.PreviousText,
              Parent: action.Parent,
              showTimeRange: false,
            });

          }

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: sendTextFilmStripUpdatedComments,
            },
            colorPickerData: null,
            colorPickerDisplay: false,
            commentUpdate: commentUpdateSendTextFilmStrip,
            selectSection: {
              ...state.selectSection,
              selectSectionStartTime: null,
              selectSectionEndTime: null,
              status: 'free',
            },
          };
        }


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
            TimeStamp: action.TimeStamp,
            Text: action.Text,
            PreviousText: action.PreviousText,
            Parent: action.Parent,
            showTimeRange: false,
          });

          if(state.updateComment){
            state.updateComment = false;

            commentUpdateSendText.edit.push({
              _id: action.uuid,
              TimeStamp: action.TimeStamp,
              TimeRange: {
                start: action.startTime,
                end: action.endTime,
              },
              Color: state.activeCommentColor,
              PreviousText: action.PreviousText,
              Text: action.Text,
              Parent: action.Parent,
              showTimeRange: false,
            });
          }else {
            //HS add the comment to comments
            commentUpdateSendText.create.push({
              _id: action.uuid,
              TimeStamp: action.TimeStamp,
              TimeRange: {
                start: action.startTime,
                end: action.endTime,
              },
              Color: state.activeCommentColor,
              PreviousText: action.PreviousText,
              Text: action.Text,
              Parent: action.Parent,
              showTimeRange: false,
            });
          }

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: sendTextUpdatedComments,
            },
            commentUpdate: commentUpdateSendText,
            colorPickerData: null,
            colorPickerDisplay: false,
            selectSection: {
              ...state.selectSection,
              selectSectionStartTime: null,
              selectSectionEndTime: null,
              status: 'free',
            },
          };

        }else{
          const sendTextUpdatedComments = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
            uuid: action.uuid,
            start: action.startTime,
            end: action.endTime,
            TimeStamp: action.TimeStamp,
            Text: action.Text,
            PreviousText: action.PreviousText,
            Parent: action.Parent,
            showTimeRange: false,
          });

          if(state.updateComment){
            state.updateComment = false;

            commentUpdateSendText.edit.push({
              _id: action.uuid,
              TimeStamp: action.TimeStamp,
              TimeRange: {
                start: action.startTime,
                end: action.endTime,
              },
              Color: state.activeCommentColor,
              PreviousText: action.PreviousText,
              Text: action.Text,
              Parent: action.Parent,
              showTimeRange: false,
            });

          }else{
            //HS add the comment
            commentUpdateSendText.create.push({
              _id: action.uuid,
              TimeStamp: action.TimeStamp,
              TimeRange: {
                start: action.startTime,
                end: action.endTime,
              },
              Color: state.activeCommentColor,
              PreviousText: action.PreviousText,
              Text: action.Text,
              Parent: action.Parent,
              showTimeRange: false,
            });

          }

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: sendTextUpdatedComments,
            },
            commentUpdate: commentUpdateSendText,
            colorPickerData: null,
            colorPickerDisplay: false,
            selectSection: {
              ...state.selectSection,
              selectSectionStartTime: null,
              selectSectionEndTime: null,
              status: 'free',
            },
          };
        }




    case actions.COMMENT_SEND_SELECTION:
      const selectSection = {
        selectSectionStartTime: action.startTime,
        selectSectionEndTime: action.endTime,
        status: 'end',
      };

      if (state.commentingMode || action.ForceComment) {

        const timeTemp = ((new Date()).getTime()*1000);
        const currentTime = (new Date(timeTemp)).toString();

        if(action.Parent){
          const [commentsReplyWithUUID, parentComment] = updateCommentStateWithReply([...state.commentData[state.activeCommentColor]], {
            start: action.startTime,
            end: action.endTime,
            TimeStamp: currentTime,
            Color: state.activeCommentColor,
            PreviousText: action.PreviousText,
            Text: action.Text,
            Parent: action.Parent,
            showTimeRange: false,
          });

          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: commentsReplyWithUUID,
            },
            commentUpdate:{
              remove: [],
              create: [],
              edit:   [],
            },
            selectSection,
          };
        }else{
          const mergedComment = [...state.commentData[state.activeCommentColor], {
            start: action.startTime,
            end: action.endTime,
            TimeStamp: currentTime,
            Color: state.activeCommentColor,
            PreviousText: action.PreviousText,
            Text: action.Text,
            Parent: action.Parent,
            showTimeRange: false,
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

      }else{
        return {
          ...state,
          selectSection,
        };
      }



      case actions.COMMENT_SELECT_SECTION_END_FS:
        const selectSectionComplete ={
            selectSectionEndTime: action.startTime,
            selectSectionStartTime: action.endTime,
            status: 'end',
        }

        const timeTempFS = ((new Date()).getTime()*1000);
        const currentTimeFS = (new Date(timeTempFS)).toString();

        if(state.commentingMode){
          const mergedCommentFS = [...state.commentData[state.activeCommentColor], {
            start: action.startTime,
            end: action.endTime,
            Color: state.activeCommentColor,
            PreviousText: action.PreviousText,
            Text: action.Text,
            TimeStamp: currentTimeFS,
            Parent: action.Parent,
            showTimeRange: false,
          }];

        const [commentsWithUUIDFS, commentUpdateFS] = commentGenerateDiff(mergedCommentFS, state.commentData[state.activeCommentColor], state.activeCommentColor);

        const updateColorPickerData = commentUpdateFS.create[0];
        console.log("Update Color Picker Data", updateColorPickerData);
          return {
            ...state,
            commentData: {
              ...state.commentData,
              [state.activeCommentColor]: commentsWithUUIDFS,
            },
            colorPickerData: updateColorPickerData,
            colorPickerDisplay: true,
            commentUpdate:{
              remove: [],
              create: [],
              edit:   [],
            },
            selectSection: selectSectionComplete,
          };

        }else{
          return{
            ...state,
            selectSection: selectSectionComplete,
            fdDelayedCommentAction: {
              start: action.startTime,
              end: action.endTime,
              Color: '',
              PreviousText: action.PreviousText,
              Text: action.Text,
              TimeStamp: currentTimeFS,
              Parent: action.Parent,
            },
            fsComCursorPosition: {
              x: action.XMouseLoc,
              y: action.YMouseLoc,
            },
          }
        }


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



    case actions.COMMENT_FILMSTRIP_EDIT_TOGGLE:
      state.updateComment = true;

      if(action.Parent){
        console.log('ss updating parent: ', action.Parent, 'for', action.uuid);

        const [editTextUpdatedCommentsFS, parentCommentFS2] = updateCommentStateWithReplyAndText([...state.commentData[state.activeCommentColor]], {
          uuid: action.uuid,
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
          Parent: action.Parent,
          TimeStamp: action.TimeStamp,
          showTimeRange: false,
        });
            return{
          ...state,
          commentData: {
            ...state.commentData,
              [state.activeCommentColor]: editTextUpdatedCommentsFS,
            },
          colorPickerDisplay: true,
            colorPickerData:  {
              _id: action.uuid,
            TimeStamp: action.TimeStamp,
            TimeRange: {
              start: action.startTime,
              end: action.endTime,
            },
            Color: action.Color,
            Text: action.Text,
            Parent: action.Parent,
            },
          commentUpdate:{
            remove:[],
            create: [],
            edit: [],
          }

        }

      }else{
          const editTextUpdatedCommentsFS = updateCommentStateWithText([...state.commentData[state.activeCommentColor]], {
          uuid: action.uuid,
          start: action.startTime,
          end: action.endTime,
          Text: action.Text,
          Parent: action.Parent,
          showTimeRange: false,
        });

        return{
          ...state,
          commentData:{
            ...state.commentData,
            [state.activeCommentColor]: editTextUpdatedCommentsFS,
          },
          commentUpdate:{
            remove: [],
            create: [],
            edit: [],
          },
          colorPickerDisplay: true,
          colorPickerData:  {
            _id: action.uuid,
          TimeStamp: action.TimeStamp,
          TimeRange: {
            start: action.startTime,
            end: action.endTime,
          },
          Color: action.Color,
          Text: action.Text,
          Parent: action.Parent,
          },
        }
      }


    case actions.COMMENT_VIEW_MORE:
        return {
          ...state,
          commentViewMore: true,
          commentViewMoreId: action.commentID
        };


    case actions.COMMENT_VIEW_MORE_FALSE:
        return {
          ...state,
          commentViewMore: false,
          commentViewMoreId: action.commentID
        };


    case actions.COMMENT_EXPAND_ALL:
          return {
            ...state,
            commentExpandAll: !state.commentExpandAll,
          };


    case actions.COMMENT_HOVER:
      const hoverUpdatedComment = updateCommentStateWithHover([...state.commentData[action.color]], {
          uuid: action.uuid,
          showTimeRange: action.showTimeRange,
        });
      return{
        ...state,
        commentData:{
        ...state.commentData,
            [action.color]: hoverUpdatedComment,
        }
      }

    case actions.COMMENT_NOT_HOVER:
      const nonHoverUpdatedComment = updateCommentStateWithHover([...state.commentData[action.color]], {
          uuid: action.uuid,
          showTimeRange: action.showTimeRange,
        });
      return{
        ...state,
        commentData:{
        ...state.commentData,
            [action.color]: nonHoverUpdatedComment,
        }
      }


    default:
      return state;
  }
};
