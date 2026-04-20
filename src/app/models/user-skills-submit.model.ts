import { GapAnalysisResponse } from '../analysis/models/analysis.models';

export interface AnalysisTargetPayload {
  area_id: string;
  job_id: string;
}

export interface SkillInputPayload {
  skill_id: string;
  user_level: number;
}

export interface UserSkillInputPayload {
  timestamp?: string;
  user_id: string;
  target: AnalysisTargetPayload;
  consent_level: number;
  skills: SkillInputPayload[];
}

export interface UserSkillsSubmitResponse extends GapAnalysisResponse {}
