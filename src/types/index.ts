export type ProductCategory = "desk" | "chair" | "monitor" | "lamp" | "plant" | "accessory";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // monthly rent in USD
  description: string;
  emoji: string;
  imageUrl?: string;
  color: string; // Tailwind color for the visual representation
  features?: string[];
}

export interface WorkspaceSetup {
  desk: Product | null;
  chair: Product | null;
  accessories: Product[];
}

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  emoji: string;
  description: string;
  selectionType: "single" | "multiple";
}
