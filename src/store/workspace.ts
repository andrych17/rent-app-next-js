"use client";

import { create } from "zustand";
import { Product, WorkspaceSetup } from "@/types";

interface WorkspaceState {
  setup: WorkspaceSetup;
  activeCategory: string;
  showCheckout: boolean;

  // Actions
  setDesk: (desk: Product) => void;
  setChair: (chair: Product) => void;
  removeDesk: () => void;
  removeChair: () => void;
  toggleAccessory: (product: Product) => void;
  removeAccessory: (productId: string) => void;
  setActiveCategory: (category: string) => void;
  setShowCheckout: (show: boolean) => void;
  clearAll: () => void;
}

const initialSetup: WorkspaceSetup = {
  desk: null,
  chair: null,
  accessories: [],
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  setup: { ...initialSetup },
  activeCategory: "desk",
  showCheckout: false,

  setDesk: (desk) =>
    set((state) => ({
      setup: { ...state.setup, desk },
    })),

  removeDesk: () =>
    set((state) => ({
      setup: { ...state.setup, desk: null },
    })),

  setChair: (chair) =>
    set((state) => ({
      setup: { ...state.setup, chair },
    })),

  removeChair: () =>
    set((state) => ({
      setup: { ...state.setup, chair: null },
    })),

  toggleAccessory: (product) =>
    set((state) => {
      const exists = state.setup.accessories.find((a) => a.id === product.id);
      if (exists) {
        return {
          setup: {
            ...state.setup,
            accessories: state.setup.accessories.filter(
              (a) => a.id !== product.id
            ),
          },
        };
      }
      return {
        setup: {
          ...state.setup,
          accessories: [...state.setup.accessories, product],
        },
      };
    }),

  removeAccessory: (productId) =>
    set((state) => ({
      setup: {
        ...state.setup,
        accessories: state.setup.accessories.filter((a) => a.id !== productId),
      },
    })),

  setActiveCategory: (category) => set({ activeCategory: category }),

  setShowCheckout: (show) => set({ showCheckout: show }),

  clearAll: () =>
    set({
      setup: { ...initialSetup, accessories: [] },
      showCheckout: false,
    }),
}));
