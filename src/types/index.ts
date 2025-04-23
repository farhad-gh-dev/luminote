import { StorageKeys } from "@/constants";
import { MessageActions } from "@/constants/message-actions";

export interface Highlight {
  id: string;
  text: string;
  url: string;
  title: string;
  createdAt: string;
  tags?: string[];
  color?: string;
}

// Use the type from the constants file
export type MessageActionType =
  (typeof MessageActions)[keyof typeof MessageActions];

export type StorageKeyType = (typeof StorageKeys)[keyof typeof StorageKeys];

export interface Message {
  action: MessageActionType;
  highlight?: Highlight;
  id?: string;
  text?: string;
}

export interface SelectionInfo {
  text: string;
  url: string;
  title: string;
}
