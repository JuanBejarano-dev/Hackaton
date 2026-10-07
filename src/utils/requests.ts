import type { MatchResult, TutoringRequest } from '@/types/domain';

/** Match del tutor asignado; si aún no hay asignación, el mejor del ranking. */
export function getAssignedMatch(request: TutoringRequest): MatchResult | undefined {
  if (request.assignedTutorId) {
    return request.matches.find((match) => match.tutor.id === request.assignedTutorId);
  }
  return request.matches[0];
}
