export type Page = {
  id: number;
  title: string;
  content: string;
  parent_id: number | null;
};

export type PageRow = {
  id: number;
  title: string;
  parent_page_id?: number;
};
