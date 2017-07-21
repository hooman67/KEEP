export function SidebarReducer(state={isOpen:false},
action){
switch(action.type){
  case "SIDEBAR_OPEN":
    return{...state,
    isOpen:!state.isOpen

    }
  }
return state
}
