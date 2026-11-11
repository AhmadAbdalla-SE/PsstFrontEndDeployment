export const otherParticipant = (conversation, myId) =>
  conversation?.participants?.find(
    (person) => String(person?._id) !== String(myId)
  ) ?? null;

export const displayName = (person) => {
  if (!person) return "Someone";
  if (person.username) return person.username;
  return [person.firstName, person.lastName].filter(Boolean).join(" ") || "Someone";
};
