export interface Area {
  id: string;
  area: string;
  description: string;
}

export interface JobTitle {
  id: number;              // ✅ NUMBER (non string)
  job_title: string;
  id_area: string;
  job_description: string;
}

export interface Skill {
  skill_id: number;
  name: string;
  category: string;
  expected_level?: number;
  weight: number;
  job_title_id?: number;   // ✅ NUMBER
  area_id?: string;
  user_score?: number;
}

export interface AssessmentPayload {
  userId: number;
  job_title_id: number;    // ✅ NUMBER
  assessments: {
    skill_id: number;
    score: number;
  }[];
  timestamp: string;
}

// Payload corretto per POST /api/user-skills/ (come da swagger)
export interface UserSkillPayload {
  timestamp: string;
  user_id: string;         // il backend vuole stringa
  target: {
    area_id: string;
    job_id: number;
  };
  consent_level: number;   // sempre 1
  skills: {
    skill_id: number;
    user_level: number;    // voto 1-10
  }[];
}

export interface ReportSlice {
  label: string;
  count: number;
  color: string;
  percentage: number;
  startAngle: number;
  endAngle: number;
}