import { client, unwrap } from "./client";

export const getConversations = async ({ page = 1, limit = 10 } = {}) =>
  unwrap(await client.get("/conversation/", { params: { page, limit } }));

export const getConversation = async (conversationId) =>
  unwrap(await client.get(`/conversation/${conversationId}`));

export const getConversationMessages = async (conversationId) =>
  unwrap(await client.get(`/conversation/${conversationId}/message`));

export const sendConversationMessage = async ({ conversationId, content, attachments = [] }) => {
  const form = new FormData();
  if (content) {
    form.append("content", content);
  }
  attachments.forEach((file) => form.append("attachments", file));

  return unwrap(await client.post(`/conversation/${conversationId}/message`, form));
};
