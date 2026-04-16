export interface CompetencyArea {
  id: string;
  name: string;
  description?: string;
}

export interface JobTitle {
  id: string;
  job_title: string;
  id_area: string;
  job_description?: string;
}

export interface JobTitleSelection {
  job_title_id: string;
  area_id: string;
}
