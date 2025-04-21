export interface Highlight {
  id: string;
  text: string;
  url: string;
  title: string;
  createdAt: string;
  tags?: string[];
  color?: string;
}

export type MessageAction =
  | "saveHighlight"
  | "getHighlights"
  | "deleteHighlight"
  | "highlightSaved"
  | "getSelectionInfo";

export interface Message {
  action: MessageAction;
  highlight?: Highlight;
  id?: string;
  text?: string;
}

export interface SelectionInfo {
  text: string;
  url: string;
  title: string;
}
