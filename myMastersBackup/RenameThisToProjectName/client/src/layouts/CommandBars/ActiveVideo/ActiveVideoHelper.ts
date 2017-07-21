export const generateHighlightToggle = (action) => {
  console.log('hs generateHighlightToggle act ActVidHelp.j');
  return [
    {
      key: 'toggleHighlight',
      name: 'Toggle Highlight',
      icon: 'ToggleBorder',
      onClick: action,
    },
  ];
};

export const generatePlayHighlight = (playHighlightAction, props, selectColorAction) => {
  console.log('hs generatePlayHighlight act ActVidHelp.j');
  return [
    {
      key: 'playHighlight',
      name: 'Play Highlight',
      icon: 'Play',
      onClick: () => (playHighlightAction(props.highlight.highlightData[props.player.highlightColor])),
    },
    {
      key: 'playHighlightColor',
      name: 'Color',
      icon: 'Color',
      items: [
        {
          key: 'playHighlightColorRed',
          name: 'Red',
          onClick: () => (selectColorAction('red')),
        },
        {
          key: 'playHighlightColorBlue',
          name: 'Blue',
          onClick: () => (selectColorAction('blue')),
        },
        {
          key: 'playHighlightColorYellow',
          name: 'Yellow',
          onClick: () => (selectColorAction('yellow')),
        },
        {
          key: 'playHighlightColorGreen',
          name: 'Green',
          onClick: () => (selectColorAction('green')),
        },
        {
          key: 'playHighlightColorPurple',
          name: 'Purple',
          onClick: () => (selectColorAction('purple')),
        },
        {
          key: 'playHighlightColorNone',
          name: 'None',
          onClick: () => (selectColorAction()),
        },
      ],
    },
  ];
};

export const generateAddHighlight = (selectColorAction) => {
  console.log('hs generateAddHighlight act ActVidHelp.j');
  return [
    {
      key: 'addHighlight',
      name: 'Add Highlight',
      icon: 'Edit',
    },
    {
      key: 'addHighlightColor',
      name: 'Color',
      icon: 'Color',
      items: [
        {
          key: 'addHighlightColorRed',
          name: 'Red',
          onClick: () => (selectColorAction('red')),
        },
        {
          key: 'addHighlightColorBlue',
          name: 'Blue',
          onClick: () => (selectColorAction('blue')),
        },
        {
          key: 'addHighlightColorYellow',
          name: 'Yellow',
          onClick: () => (selectColorAction('yellow')),
        },
        {
          key: 'addHighlightColorGreen',
          name: 'Green',
          onClick: () => (selectColorAction('green')),
        },
        {
          key: 'addHighlightColorPurple',
          name: 'Purple',
          onClick: () => (selectColorAction('purple')),
        },
        {
          key: 'addHighlightColorNone',
          name: 'None',
          onClick: () => (selectColorAction()),
        },
      ],
    },
  ];
};

export const generateRemoveHighlight = (removeHighlightAction, toggleMultipleHighlightRemovalAction, removeOffAction) => {
  console.log('hs toggleMultipleHighlightRemovalAction act ActVidHelp.j');
  return([
    {
      key: 'removeHighlight',
      name: 'Remove Highlight',
      icon: 'EraseTool',
      onClick: removeHighlightAction,
    },
    {
      key: 'removeHighlightColor',
      name: 'Action',
      icon: 'MultiSelect',
      items: [
        {
          key: 'removeSingleColor',
          name: 'Single Color',
          onClick: toggleMultipleHighlightRemovalAction,
        },
        {
          key: 'removeAllColor',
          name: 'All Color',
          onClick: toggleMultipleHighlightRemovalAction,
        },
        {
          key: 'removeHighlightColorNone',
          name: 'None',
          onClick: removeOffAction,
        },
      ],
    },
  ]);
};
