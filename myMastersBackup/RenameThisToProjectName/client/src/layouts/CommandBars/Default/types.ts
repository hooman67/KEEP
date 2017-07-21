import { IContextualMenuItem } from 'office-ui-fabric-react/lib/components/ContextualMenu';

export interface IDefault {
  searchBoxVisible: boolean;
  searchPlaceholderTex: string;
  items: Array<IContextualMenuItem>;
  farItems?: Array<IContextualMenuItem>;
}

export default IDefault;
