export type SkillType = 'Language' | 'software' | 'framework' | 'knowledge';
  
export interface Skill {
    id: string;
    skill: string;
    type: SkillType;
    expected_level?: number;
    weight: number;
    user_score?: number;
}
