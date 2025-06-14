/**
 * Types for the 42 API responses
 * Based on documentation at https://api.intra.42.fr/apidoc/endpoints/users
 */

export interface User {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  displayname: string;
  url: string;
  phone: string;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  };
  staff?: boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  created_at: string;
  updated_at: string;
  alumni: boolean;
  is_alumni: boolean;

  // Relationships
  campus: Campus[];
  campus_users: CampusUser[];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
  languages_users: LanguageUser[];
  achievements: Achievement[];
  titles: Title[];
  titles_users: TitleUser[];
  partnerships: Partnership[];
  patroned: User[];
  patroning: User[];
  expertises_users: ExpertiseUser[];
  coalition?: Coalition;
  coalition_users: CoalitionUser[];
}

export interface Campus {
  id: number;
  name: string;
  country: string;
  city: string;
  website: string;
  facebook: string;
  twitter: string;
  active: boolean;
  public: boolean;
  address: string;
  zip: string;
  users_count: number;
  created_at: string;
  updated_at: string;
}

export interface CampusUser {
  id: number;
  user_id: number;
  campus_id: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CursusUser {
  id: number;
  begin_at: string;
  end_at: string | null;
  grade: string | null;
  level: number;
  skills: Skill[];
  cursus_id: number;
  has_coalition: boolean;
  user: {
    id: number;
    login: string;
    url: string;
  };
  cursus: {
    id: number;
    created_at: string;
    name: string;
    slug: string;
    kind: string;
  };
}

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface ProjectUser {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status:
    | "finished"
    | "in_progress"
    | "searching_a_group"
    | "creating_group"
    | "waiting_for_correction";
  "validated?": boolean;
  current_team_id: number;
  project: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  };
  cursus_ids: number[];
  marked_at: string | null;
  marked: boolean;
  retriable_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LanguageUser {
  id: number;
  language_id: number;
  user_id: number;
  position: number;
  created_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  tier: string;
  kind: string;
  visible: boolean;
  image: string;
  nbr_of_success: number;
  users_url: string;
}

export interface Title {
  id: number;
  name: string;
}

export interface TitleUser {
  id: number;
  user_id: number;
  title_id: number;
  selected: boolean;
}

export interface Partnership {
  id: number;
  name: string;
  slug: string;
  difficulty: number;
}

export interface ExpertiseUser {
  id: number;
  expertise_id: number;
  interested: boolean;
  value: number;
  contact_me: boolean;
  created_at: string;
  user_id: number;
}

export interface Coalition {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  color: string;
  score: number;
  user_id: number;
}

export interface CoalitionUser {
  id: number;
  coalition_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}
