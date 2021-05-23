export interface MessageVM {
  id?: number;
  senderId?: number;
  chatRoomId?: number;
  text?: string;
  createdOn?: string;
  seen?: boolean;
}
