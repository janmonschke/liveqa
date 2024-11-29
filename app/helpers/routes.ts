export function qa(qaId: string) {
  return `/qa/${qaId}`;
}

export function qaQr(qaId: string) {
  return `/qa/qr/${qaId}`;
}

export function qaQuestionCrud(qaId: string) {
  return `${qa(qaId)}/question`;
}

export function qaVoteCrud(qaId: string) {
  return `${qa(qaId)}/vote`;
}

export function qaAdmin(qaId: string) {
  return `/qa/admin/${qaId}`;
}

export function qaTopicCrud(qaId: string) {
  return `${qaAdmin(qaId)}/topic`;
}

export function qaTopicSwap(qaId: string) {
  return `${qaAdmin(qaId)}/topic/swap`;
}

export function qaConfigCrud(qaId: string) {
  return `${qaAdmin(qaId)}/config`;
}

export function qaAdminQuestionCrud(qaId: string) {
  return `${qaAdmin(qaId)}/question`;
}
