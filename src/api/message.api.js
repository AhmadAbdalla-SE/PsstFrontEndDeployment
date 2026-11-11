import { MessageFeed } from "@/lib/enums";
import { client, unwrap } from "./client";

export const sendMessage = async ({ receiverId, content, attachments = [], anonymous = true }) => {
  const form = new FormData();
  form.append("receiverId", receiverId);
  if (content) {
    form.append("content", content);
  }
  attachments.forEach((file) => form.append("attachments", file));

  return unwrap(await client.post("/message/", form, { skipAuth: anonymous }));
};

export const getMessages = async ({ type = MessageFeed.RECEIVED, page = 1, limit = 9 } = {}) =>
  unwrap(await client.get("/message/", { params: { type, page, limit } }));

export const getMessage = async (messageId) =>
  unwrap(await client.get(`/message/${messageId}`));

export const deleteMessage = async (messageId) =>
  unwrap(await client.delete(`/message/${messageId}`));
