import { UUID } from "crypto";

export interface Post {
  id: UUID;
  title: string;

  content: string;

  created_at: string;
  updated_at: string;
}

export interface User {
  id: UUID;
  name: string;
  email: string;
}
