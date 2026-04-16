export interface CompetencyArea {
  id: string;
  name: string;
  description?: string;
}

export interface JobTitle {
  id: string;
  name: string;
  area_id: string;
  description?: string;
}

export interface JobTitleSelection {
  job_title_id: string;
  area_id: string;
}
