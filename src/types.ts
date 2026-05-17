import { ButtonHTMLAttributes, ReactNode } from "react";

export type Route = 'home' | 'booking' | 'products';

export interface NavItem {
  label: string;
  route: Route;
}

export interface GalleryItem {
  title: string;
  category: string;
  image: string;
}

export interface TimelineStep {
  title: string;
  text: string;
  icon: string;
}

export interface ProductCard {
  title: string;
  description: string;
  image: string;
}

export type SlotId = '10-12' | '12-2' | '2-4' | '4-6' | '6-8';

export interface BookingSlot {
  id: SlotId;
  label: string;
  short: string;
}

export type BookingsByDate = Record<string, SlotId[]>;

export type ImpressionType = 'hands' | 'feet' | 'both';

export type FrameStyle =
  | 'Classic Cream'
  | 'Blush Gold'
  | 'Baby Blue LED'
  | 'Premium Shadow Box';

export interface ContactFormState {
  name: string;
  phone: string;
  city: string;
  babyAge: string;
  message: string;
}




export type Navigate = (nextRoute: Route) => void;

export type ButtonVariant = 'primary' | 'soft' | 'ghost';


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
}

export interface SectionShellProps {
    id: string;
    eyebrow?: string;
    title?: string;
    copy?: string;
    children: ReactNode;
    className?: string;
}

export interface RouteProps {
    navigate: Navigate;
}

export interface NavbarProps extends RouteProps {
    route: Route;
}

export interface DatePickerProps {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}

export interface FormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export interface FramePreviewStyle {
    shell: string;
    mat: string;
    accent: string;
    line: string;
}

export interface ImpressionPreview {
    label: string;
    description: string;
    marks: string[];
}