export type VacancyResponse = {
  objects: Vacancy[];
  total: number;
  more: boolean;
  subscription_id: number;
  subscription_active: boolean;
  corrected_keyword?: string;
};

export interface Vacancy {
  canEdit: boolean;
  is_closed: boolean;
  id: number;
  id_client: number;
  payment_from: number;
  payment_to: number;
  date_pub_to: number;
  date_archived: number;
  date_published: number;
  address: string;
  profession: string;
  work: any;
  compensation: any;
  candidat: string;
  metro: any[];
  currency: string;
  vacancyRichText: string;
  covid_vaccination_requirement: CovidVaccinationRequirement;
  external_url: any;
  contact: string;
  moveable: boolean;
  agreement: boolean;
  anonymous: boolean;
  is_archive: boolean;
  is_storage: boolean;
  type_of_work: TypeOfWork;
  place_of_work: PlaceOfWork;
  education: Education;
  experience: Experience;
  maritalstatus: Maritalstatus;
  children: Children;
  client: Client;
  languages: any[];
  driving_licence: any[];
  catalogues: Catalogue[];
  agency: Agency;
  town: Town;
  already_sent_on_vacancy: boolean;
  rejected: boolean;
  response_info: any[];
  phone: string;
  phones: Phone[];
  fax: any;
  faxes: any;
  favorite: boolean;
  client_logo: string;
  highlight: boolean;
  age_from: number;
  age_to: number;
  gender: Gender;
  firm_name: string;
  firm_activity: string;
  link: string;
  isBlacklisted: boolean;
  latitude: number;
  longitude: number;
}

interface CovidVaccinationRequirement {
  id: number;
  title: string;
}

interface TypeOfWork {
  id: number;
  title: string;
}

interface PlaceOfWork {
  id: number;
  title: string;
}

interface Education {
  id: number;
  title: string;
}

interface Experience {
  id: number;
  title: string;
}

interface Maritalstatus {
  id: number;
  title: string;
}

interface Children {
  id: number;
  title: string;
}

interface Client {
  id: number;
  title: string;
  link: string;
  industry: any[];
  description: string;
  vacancy_count: number;
  staff_count: string;
  client_logo: string;
  address: string;
  addresses: Address[];
  url: string;
  short_reg: boolean;
  is_blocked: boolean;
  registered_date: number;
  town: Town;
}

interface Address {
  addressString: string;
  latitude: number;
  longitude: number;
  phones: any[];
}

interface Town {
  id: number;
  title: string;
  declension: string;
  hasMetro: boolean;
  genitive: string;
}

interface Catalogue {
  id: number;
  title: string;
  key: number;
  positions: Position[];
}

interface Position {
  id: number;
  title: string;
  key: number;
}

interface Agency {
  id: number;
  title: string;
}

interface Phone {
  number: number;
  additionalNumber: any;
}

interface Gender {
  id: number;
  title: string;
}
