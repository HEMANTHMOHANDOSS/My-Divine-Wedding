import { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface StoryProps {
  id: number;
  couple: string;
  image: string;
  story: string;
  date: string;
}

export interface SearchOption {
  value: string;
  label: string;
}