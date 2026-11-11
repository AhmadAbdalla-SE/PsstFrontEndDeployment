import { RequestFeed, RequestStatus } from "@/lib/enums";
import { client, unwrap } from "./client";

export const createRevealRequest = async ({ messageId }) =>
  unwrap(await client.post("/request/", { messageId }));

export const getRequests = async ({ type = RequestFeed.INCOMING, page = 1, limit = 10 } = {}) =>
  unwrap(await client.get("/request/", { params: { type, page, limit } }));

export const decideRequest = async ({ requestId, status }) =>
  unwrap(await client.patch(`/request/${requestId}`, { status }));

export const acceptRequest = (requestId) =>
  decideRequest({ requestId, status: RequestStatus.ACCEPTED });

export const rejectRequest = (requestId) =>
  decideRequest({ requestId, status: RequestStatus.REJECTED });
