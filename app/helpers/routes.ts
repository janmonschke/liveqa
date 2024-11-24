export function qa(qaId: string) {
  return `/qa/${qaId}`
}

export function qaAdmin(qaId: string) {
  return `/qa/admin/${qaId}`;
}

export function qaTopicCrud(qaId: string) {
  return `${qaAdmin(qaId)}/topic`;
}

export function qaConfigCrud(qaId: string) {
  return `${qaAdmin(qaId)}/config`;
}
