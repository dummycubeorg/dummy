export type ServerResponse = {
  code: string;
  message: string;
  error?: string;
  data?: unknown;
};

export type Todo = {
  id: number;
  title: string;
  content: string;
};
