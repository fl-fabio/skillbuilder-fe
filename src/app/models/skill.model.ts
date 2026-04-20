export type SkillType = 'Language' | 'software' | 'framework' | 'knowledge';
  
export interface Skill {
    id: string;
    skill: string;
    type: SkillType;
    expected_level?: number;
    weight: number;
    user_score?: number;
}

export interface UserConfig {
    user_id: string;
    target: {
        area_id: string;
        job_id: number;
    };
    consent_level: number;
    skills: {
        skill_id: number;
        user_level: number;
    }[];
}