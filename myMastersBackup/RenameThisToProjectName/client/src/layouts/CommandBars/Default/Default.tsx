import React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import IDefault from './types';

const Default = (props: IDefault) => (
  <div>
    <CommandBar
      isSearchBoxVisible={props.searchBoxVisible}
      searchPlaceholderText={props.searchPlaceholderTex}
      items={props.items}
      farItems={props.farItems}
    />
  </div>
);

export default Default;
