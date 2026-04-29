import type { BookingSlot, GalleryItem, ProductCard, TimelineStep } from './types';

export const galleryItems: GalleryItem[] = [
  {
    title: 'Single Baby Frame',
    category: 'First impressions',
    image:
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Family Frame',
    category: 'Together forever',
    image:
      'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Premium LED Frame',
    category: 'Soft glowing keepsake',
    image:
      'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Tiny Feet Story',
    category: 'Newborn detail',
    image:
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Blush Memory Frame',
    category: 'Pastel collection',
    image:
      'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Baby Blue Keepsake',
    category: 'Premium matte finish',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=85'
  }
];

export const timelineSteps: TimelineStep[] = [
  {
    title: 'Tell Us About Your Baby',
    text: 'Share age, family members, favorite colors, and the little details you want preserved.',
    icon: '♡'
  },
  {
    title: 'Get Personalized Design Suggestions',
    text: 'We suggest frame styles, layouts, colors, and keepsake ideas that match your story.',
    icon: '✦'
  },
  {
    title: 'Confirm Design, Timeline & Cost (10% advance later)',
    text: 'You approve the design direction, expected timeline, and transparent mock estimate.',
    icon: '✓'
  },
  {
    title: 'Delivered with Love after your full satisfaction',
    text: 'Your finished memory frame reaches you beautifully packed and ready to treasure.',
    icon: '♥'
  }
];

export const productCards: ProductCard[] = [
  {
    title: 'Custom Diwali Diyas',
    description: 'Warm festive keepsakes with names, dates, and delicate hand-painted details.',
    image:
      'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Personalized Baby Hampers',
    description: 'Soft curated bundles for newborn gifting, naming ceremonies, and milestones.',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Name Frames',
    description: 'Premium name displays with pastel palettes, tiny motifs, and memory details.',
    image:
      'https://images.unsplash.com/photo-1527866512907-a35a62a0f6c5?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Occasion Gift Boxes',
    description: 'Personal gift stories for birthdays, baby showers, festivals, and firsts.',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=85'
  }
];

export const slots: BookingSlot[] = [
  { id: '10-12', label: '10:00 AM - 12:00 PM', short: '10-12' },
  { id: '12-2', label: '12:00 PM - 2:00 PM', short: '12-2' },
  { id: '2-4', label: '2:00 PM - 4:00 PM', short: '2-4' },
  { id: '4-6', label: '4:00 PM - 6:00 PM', short: '4-6' },
  { id: '6-8', label: '6:00 PM - 8:00 PM', short: '6-8' }
];
