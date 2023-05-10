export type CatalogIndustriesResponse = CatalogIndustry[];

interface CatalogIndustry {
  title_rus: string;
  url_rus: string;
  title: string;
  title_trimmed: string;
  key: number;
  positions: Position[];
}

interface Position {
  title_rus: string;
  url_rus: string;
  title: string;
  id_parent: number;
  key: number;
}
