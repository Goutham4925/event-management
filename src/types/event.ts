export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  client: string;
  coverImage: string;
  featured: boolean;

  gallery: {
    id?: string;
    imageUrl: string;
  }[];
}
