export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          name: string;
          school: string;
          grad_year: number;
          gpa: number;

          major: string; // NOT array in your DB
          grad_school_interest: boolean;

          creative_or_analytical: string;
          general_talents: string[];

          soft_or_hard_skills: string;
          soft_skills: string[];
          hard_skills: string[];

          employee_type: string;
          target_salary: number;

          desired_field: string[];
          desired_outcome: string;

          clubs_organizations: string[];

          tech_or_no: boolean; // ⚠️ NOT boolean in your DB
          work_environment: string;

          grad_school_career: boolean; // ⚠️ NOT boolean
          willingness_to_overwork: boolean; // ⚠️ NOT boolean

          people_or_task: string;
          desired_location: string;

          workplace_values: string[] | null;

          user_id: string; // uuid
          skill_gaps: string | null;
        };

        Insert: {
          name: string;
          school: string;
          grad_year: number;
          gpa: number;

          major: string;
          grad_school_interest: boolean;

          creative_or_analytical: string;
          general_talents: string[];

          soft_or_hard_skills: string;
          soft_skills: string[];
          hard_skills: string[];

          employee_type: string;
          target_salary: number;

          desired_field: string[];
          desired_outcome: string;

          clubs_organizations: string[];

          tech_or_no: string;
          work_environment: string;

          grad_school_career: boolean;
          willingness_to_overwork: boolean;

          people_or_task: string;
          desired_location: string;

          workplace_values?: string[] | null;

          user_id: string;
          skill_gaps?: string | null;
        };

        Update: {
          name?: string;
          school?: string;
          grad_year?: number;
          gpa?: number;

          major?: string;
          grad_school_interest?: boolean;

          creative_or_analytical?: string;
          general_talents?: string[];

          soft_or_hard_skills?: string;
          soft_skills?: string[];
          hard_skills?: string[];

          employee_type?: string;
          target_salary?: number;

          desired_field?: string[];
          desired_outcome?: string;

          clubs_organizations?: string[];

          tech_or_no?: string;
          work_environment?: string;

          grad_school_career?: string;
          willingness_to_overwork?: string;

          people_or_task?: string;
          desired_location?: string;

          workplace_values?: string[] | null;

          user_id?: string;
          skill_gaps?: string | null;
        };
      };
    };
  };
}