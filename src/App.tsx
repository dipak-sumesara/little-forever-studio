import type { ButtonHTMLAttributes, ChangeEvent, FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { galleryItems, productCards, slots, timelineSteps } from './data';
import type {
  BookingsByDate,
  ButtonProps,
  ButtonVariant,
  ContactFormState,
  DatePickerProps,
  FormInputProps,
  FramePreviewStyle,
  FrameStyle,
  ImpressionPreview,
  ImpressionType,
  NavbarProps,
  Navigate,
  NavItem,
  Route,
  RouteProps,
  SectionShellProps,
  SlotId
} from './types';
import { addDays, classNames, formatDisplayDate, getMonthDays, toISODate } from './utils';

import BookingModal from './components/booking/BookingModal';



const navItems: NavItem[] = [
  { label: 'Memories', route: 'home' },
  { label: 'Book Appointment', route: 'booking' },
  { label: 'Custom Products', route: 'products' }
];

const validRoutes: Route[] = ['home', 'booking', 'products'];

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } }
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const journeyStep: Variants = {
  hidden: { opacity: 0, x: -24, y: 34, scale: 0.97 },
  show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.75, ease: 'easeOut' } }
};

const heroText: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.08 } }
};

const heroTextItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
};


const impressionOptions: ImpressionType[] = ['hands', 'feet', 'both'];

const frameOptions: FrameStyle[] = [
  'Classic Cream',
  'Blush Gold',
  'Baby Blue LED',
  'Premium Shadow Box'
];

const impressionPrices: Record<ImpressionType, number> = {
  hands: 600,
  feet: 600,
  both: 1100
};

const framePrices: Record<FrameStyle, number> = {
  'Classic Cream': 1600,
  'Blush Gold': 2200,
  'Baby Blue LED': 3200,
  'Premium Shadow Box': 3800
};

const framePreviewStyles: Record<FrameStyle, FramePreviewStyle> = {
  'Classic Cream': {
    shell: 'from-cream via-white to-linen',
    mat: 'bg-cream/85 border-beige/35',
    accent: 'bg-white text-cocoa',
    line: 'bg-beige/55'
  },
  'Blush Gold': {
    shell: 'from-petal via-cream to-blush/60',
    mat: 'bg-petal/60 border-blush/50',
    accent: 'bg-white text-cocoa',
    line: 'bg-blush/70'
  },
  'Baby Blue LED': {
    shell: 'from-mistblue via-white to-babyblue/60',
    mat: 'bg-mistblue/70 border-babyblue/60',
    accent: 'bg-white text-ink shadow-[0_0_28px_rgba(185,221,244,0.75)]',
    line: 'bg-babyblue/80'
  },
  'Premium Shadow Box': {
    shell: 'from-ink via-cocoa to-beige',
    mat: 'bg-cream/90 border-white/50',
    accent: 'bg-ink text-cream',
    line: 'bg-cocoa/55'
  }
};

const impressionPreviews: Record<ImpressionType, ImpressionPreview> = {
  hands: {
    label: 'Tiny hands',
    description: 'Hand impression focus',
    marks: ['Palm', 'Fingers']
  },
  feet: {
    label: 'Tiny feet',
    description: 'Foot impression focus',
    marks: ['Heel', 'Toes']
  },
  both: {
    label: 'Hands and feet',
    description: 'Complete impression set',
    marks: ['Palm', 'Toes', 'Heel']
  }
};

const galleryDepthOffsets = [
  'lg:mt-0',
  'sm:mt-8 lg:mt-12',
  'sm:-mt-2 lg:-mt-4',
  'sm:mt-6 lg:mt-10',
  'sm:-mt-1 lg:-mt-5',
  'sm:mt-10 lg:mt-14'
];

const productDepthOffsets = ['lg:mt-0', 'lg:mt-8', 'lg:-mt-3', 'lg:mt-5'];

function isRoute(value: string): value is Route {
  return validRoutes.includes(value as Route);
}

function isFrameStyle(value: string): value is FrameStyle {
  return frameOptions.includes(value as FrameStyle);
}

function createEmptyContactForm(): ContactFormState {
  return {
    name: '',
    phone: '',
    city: '',
    babyAge: '',
    message: ''
  };
}

function useHashRoute(): [Route, Navigate] {
  const readRoute = (): Route => {
    const route = window.location.hash.replace('#/', '');
    return isRoute(route) ? route : 'home';
  };
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate: Navigate = (nextRoute) => {
    window.location.hash = `/${nextRoute}`;
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return [route, navigate];
}

function useAnimatedNumber(value: number): number {
  const previousValue = useRef<number>(value);
  const [displayedValue, setDisplayedValue] = useState<number>(value);

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration: 0.65,
      ease: 'easeOut',
      onUpdate: (latestValue) => setDisplayedValue(Math.round(latestValue))
    });

    previousValue.current = value;
    return () => controls.stop();
  }, [value]);

  return displayedValue;
}

function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-ink text-cream shadow-soft hover:-translate-y-0.5 hover:bg-cocoa focus-visible:outline-ink',
    soft:
      'bg-white/75 text-ink premium-shadow ring-1 ring-white/70 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-blush',
    ghost:
      'bg-transparent text-cocoa ring-1 ring-cocoa/15 hover:bg-white/70 focus-visible:outline-cocoa'
  };

  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SectionShell({ id, eyebrow, title, copy, children, className }: SectionShellProps) {
  return (
    <section id={id} className={classNames('px-5 py-16 sm:px-8 lg:px-12 lg:py-24', className)}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || copy) && (
          <motion.div
            className="mx-auto mb-10 max-w-3xl text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {eyebrow && (
              <p className="mb-3 font-body text-xs font-semibold uppercase text-cocoa/70">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-semibold leading-[1.14] text-ink sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {copy && (
              <p className="mt-4 font-body text-base font-light leading-8 text-cocoa/80 sm:text-lg">
                {copy}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

function FloatingShapes() {
  const shapes: string[] = [
    'left-[8%] top-[18%] h-16 w-16 bg-blush/35',
    'right-[12%] top-[24%] h-24 w-24 bg-babyblue/35',
    'bottom-[18%] left-[18%] h-20 w-20 bg-linen/80',
    'bottom-[12%] right-[18%] h-12 w-12 bg-white/60'
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {shapes.map((shape, index) => (
        <motion.span
          key={shape}
          className={classNames('absolute rounded-full blur-sm', shape)}
          animate={{ y: [0, -18, 0], x: [0, index % 2 ? 12 : -10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.span
        className="absolute right-[28%] top-[40%] text-3xl text-blush/70"
        animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ♥
      </motion.span>
      <motion.span
        className="absolute left-[28%] top-[34%] text-2xl text-babyblue/80"
        animate={{ y: [0, 12, 0], rotate: [8, -8, 8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        ♡
      </motion.span>
    </div>
  );
}

function Navbar({ route, navigate }: NavbarProps) {
  const [open, setOpen] = useState<boolean>(false);

  const go = (nextRoute: Route): void => {
    setOpen(false);
    navigate(nextRoute);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-cream/85 px-5 py-3 shadow-[0_14px_46px_rgba(111,81,66,0.09)] backdrop-blur-xl sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button
          onClick={() => go('home')}
          className="group flex items-center gap-3 rounded-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-petal text-lg text-cocoa premium-shadow transition group-hover:scale-105">
            ♥
          </span>
          <span>
            <span className="block font-display text-lg font-semibold leading-none text-ink">
              Little Forever
            </span>
            <span className="mt-1 block font-body text-xs font-medium uppercase text-cocoa/60">
              Studio
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-2 rounded-full bg-white/55 p-1 shadow-soft ring-1 ring-white/80 md:flex">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => go(item.route)}
              className={classNames(
                'rounded-full px-5 py-2.5 text-sm font-medium transition',
                route === item.route ? 'bg-ink text-cream shadow-soft' : 'text-cocoa hover:bg-white/80'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <Button onClick={() => go('booking')} className="px-5 py-2.5">
            Create Your Memory
          </Button>
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/75 text-cocoa shadow-soft ring-1 ring-white/80 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{open ? '×' : '☰'}</span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-3xl bg-white/90 p-2 shadow-soft ring-1 ring-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => go(item.route)}
                className={classNames(
                  'block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition',
                  route === item.route ? 'bg-petal text-ink' : 'text-cocoa hover:bg-cream'
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ navigate }: RouteProps) {
  const scrollToPreview = (): void => {
    navigate('home');
    setTimeout(() => {
      document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[#fff8f2] px-5 py-12 sm:px-8 lg:px-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,248,237,0.72)_0%,rgba(252,232,238,0.38)_42%,rgba(233,247,255,0.5)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream/65 via-cream/10 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          className="pt-10 sm:pt-16 lg:pt-20"
          variants={heroText}
          initial="hidden"
          animate="show"
        >
          <motion.span
            className="inline-flex rounded-full bg-white/65 px-4 py-2 font-body text-xs font-semibold uppercase text-cocoa premium-shadow ring-1 ring-white/80"
            variants={heroTextItem}
          >
            Baby impressions and memory frames
          </motion.span>
          <motion.h1
            className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.06] text-ink sm:text-6xl lg:text-7xl"
            variants={heroTextItem}
          >
            Before they grow... hold onto this moment forever.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl font-body text-lg font-light leading-8 text-cocoa/85 sm:text-xl sm:leading-9"
            variants={heroTextItem}
          >
            We preserve your baby's tiniest details into timeless 3D keepsakes.
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={heroTextItem}>
            <Button onClick={scrollToPreview} className="premium-shadow sm:px-8">
              Create Your Memory
            </Button>
            <Button variant="soft" onClick={() => navigate('booking')} className="sm:px-8">
              Book Appointment
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative pb-8 lg:pb-0"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.85, ease: 'easeOut' }}
        >
          <div className="absolute -left-4 top-12 h-32 w-32 rounded-full bg-blush/35 blur-3xl" />
          <div className="absolute -right-2 bottom-8 h-40 w-40 rounded-full bg-babyblue/40 blur-3xl" />
          <div className="relative mx-auto max-w-md rounded-[2.5rem] bg-gradient-to-br from-white/80 via-petal/30 to-mistblue/45 p-3 premium-shadow ring-1 ring-white/80 sm:max-w-lg">
            <div className="overflow-hidden rounded-[2rem] premium-shadow">
              <motion.img
                src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1000&q=90"
                alt="Newborn baby memory moment"
                className="h-[460px] w-full object-cover sm:h-[560px]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <motion.div
              className="absolute -bottom-4 left-5 right-5 rounded-[1.7rem] bg-cream/90 p-4 premium-shadow backdrop-blur"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="font-display text-xl font-semibold leading-snug text-ink">
                First-touch keepsakes
              </p>
              <p className="mt-1 font-body text-sm font-light leading-6 text-cocoa/75">
                Soft 3D impressions, personal text, and frame finishes chosen around your baby.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <SectionShell
      id="gallery"
      eyebrow="Gallery"
      title="Tiny hands, soft feet, big feelings"
      copy="A quiet collection of pastel keepsakes, family frames, and premium LED memories designed for newborn stories."
      className="bg-cream organic-texture"
    >
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        {galleryItems.map((item, index) => (
          <motion.article
            key={item.title}
            className={classNames(
              'group overflow-hidden rounded-[2rem] bg-white p-[1px] premium-shadow ring-1 ring-white/80',
              galleryDepthOffsets[index % galleryDepthOffsets.length]
            )}
            variants={fadeIn}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <div className="rounded-[1.95rem] bg-white/88 p-3">
              <div className="overflow-hidden rounded-[1.55rem] premium-shadow">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="px-2 pb-3 pt-5">
                <p className="font-body text-xs font-semibold uppercase text-cocoa/55">
                  {item.category}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">
                  {item.title}
                </h3>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}

function HowItWorks() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How it works"
      title="A gentle path from first hello to finished frame"
      copy="Every keepsake begins with your baby’s story and moves at a pace that feels calm, clear, and personal."
      className="bg-gradient-to-b from-petal/60 via-cream to-mistblue/70 organic-texture"
    >
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          className="absolute left-7 top-8 h-[calc(100%-4rem)] w-px origin-top bg-gradient-to-b from-blush via-beige to-babyblue"
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 1.35, ease: 'easeOut' }}
          aria-hidden="true"
        />
        <div className="space-y-8 sm:space-y-10">
          {timelineSteps.map((step, index) => (
            <motion.article
              key={step.title}
              className={classNames(
                'group relative grid min-h-[42vh] grid-cols-[4rem_1fr] content-center gap-4 rounded-[2rem] soft-card p-5 premium-shadow ring-1 ring-white/90 backdrop-blur transition-shadow duration-300 hover:premium-shadow sm:min-h-[46vh] md:grid-cols-[5rem_1fr] md:p-7',
                index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'
              )}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.55, margin: '0px 0px -12% 0px' }}
              variants={journeyStep}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 230, damping: 24 }}
            >
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush to-babyblue font-display text-2xl text-ink premium-shadow ring-8 ring-white/75 transition-transform duration-300 group-hover:scale-105">
                {step.icon}
              </div>
              <div className="pt-0.5">
                <p className="font-body text-sm font-semibold uppercase text-cocoa/55">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 font-body font-light leading-7 text-cocoa/78">{step.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function CustomizationPreview({ navigate }: RouteProps) {
  const [members, setMembers] = useState<number>(3);
  const [impression, setImpression] = useState<ImpressionType>('both');
  const [frame, setFrame] = useState<FrameStyle>('Classic Cream');
  const [customText, setCustomText] = useState<string>('Our tiniest forever');

  const price = useMemo<number>(() => {
    const impressionCost = impressionPrices[impression];
    const frameCost = framePrices[frame];
    return frameCost + members * 450 + impressionCost + Math.max(customText.length - 20, 0) * 8;
  }, [members, impression, frame, customText]);
  const displayedPrice = useAnimatedNumber(price);
  const framePreview = framePreviewStyles[frame];
  const impressionPreview = impressionPreviews[impression];
  const memberMarkers = useMemo<number[]>(
    () => Array.from({ length: members }, (_, index) => index + 1),
    [members]
  );

  const handleFrameChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextFrame = event.target.value;
    if (isFrameStyle(nextFrame)) {
      setFrame(nextFrame);
    }
  };

  return (
    <SectionShell
      id="customize"
      eyebrow="Preview"
      title="Shape the memory before we make it"
      copy="Try a simple mock configuration and see how your keepsake estimate changes."
      className="bg-cream organic-texture"
    >
      <motion.div
        className="grid gap-6 rounded-[2.25rem] bg-gradient-to-br from-white/88 via-petal/15 to-mistblue/20 p-4 premium-shadow ring-1 ring-white/85 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8"
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className={classNames(
            'rounded-[1.75rem] bg-gradient-to-br p-5 premium-shadow transition-colors duration-500 sm:p-6 lg:-mt-3',
            framePreview.shell
          )}
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <motion.div
            className="aspect-[4/5] rounded-[1.4rem] bg-white/72 p-4 premium-shadow transition-shadow duration-500"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <div
              className={classNames(
                'grid h-full place-items-center overflow-hidden rounded-[1.1rem] border border-dashed text-center transition-colors duration-500',
                framePreview.mat
              )}
            >
              <div className="w-full px-4">
                <motion.div
                  className={classNames(
                    'mx-auto grid h-28 w-28 place-items-center rounded-full text-4xl shadow-soft transition-colors duration-500',
                    framePreview.accent
                  )}
                  key={`${frame}-${impression}`}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  ♥
                </motion.div>

                <div className="mx-auto mt-5 flex max-w-xs justify-center gap-2">
                  <AnimatePresence mode="popLayout">
                    {impressionPreview.marks.map((mark) => (
                      <motion.span
                        key={mark}
                        className="rounded-full bg-white/80 px-3 py-1 font-body text-xs font-semibold text-cocoa shadow-sm"
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                      >
                        {mark}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.p
                  className="mt-4 font-display text-3xl font-semibold leading-snug text-ink"
                  key={frame}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {frame}
                </motion.p>
                <motion.p
                  className="mt-2 font-body text-sm font-medium uppercase text-cocoa/55"
                  key={`${members}-${impression}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  {members} member{members > 1 ? 's' : ''} · {impressionPreview.label}
                </motion.p>

                <div className="mx-auto mt-4 flex max-w-[13rem] flex-wrap justify-center gap-1.5">
                  <AnimatePresence mode="popLayout">
                    {memberMarkers.map((marker) => (
                      <motion.span
                        key={marker}
                        className={classNames('h-2.5 w-2.5 rounded-full', framePreview.line)}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <motion.p
                  className="mx-auto mt-4 max-w-xs font-body text-lg font-light leading-7 text-cocoa/85"
                  key={customText}
                  initial={{ opacity: 0.55 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  “{customText}”
                </motion.p>
                <p className="mt-3 font-body text-xs font-medium text-cocoa/55">
                  {impressionPreview.description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="space-y-6 rounded-[1.75rem] bg-white/35 p-1 soft-grain sm:p-2 lg:translate-y-3">
          <label className="block">
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">
              Number of members
            </span>
            <div className="mt-3 flex items-center gap-4">
              <motion.div className="w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={members}
                  onChange={(event) => setMembers(Number(event.target.value))}
                  className="w-full cursor-pointer accent-cocoa transition-opacity hover:opacity-90"
                />
              </motion.div>
              <motion.span
                key={members}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-petal font-body font-semibold text-ink premium-shadow"
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                {members}
              </motion.span>
            </div>
          </label>

          <div>
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">
              Impression type
            </span>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-3xl bg-cream p-1">
              {impressionOptions.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setImpression(type)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  animate={{ scale: impression === type ? 1.04 : 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className={classNames(
                    'rounded-full px-3 py-3 text-sm font-semibold capitalize transition-colors',
                    impression === type
                      ? 'bg-ink text-cream shadow-soft ring-4 ring-blush/20'
                      : 'text-cocoa hover:bg-white hover:premium-shadow'
                  )}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">
              Frame style
            </span>
            <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 240 }}>
              <select
                value={frame}
                onChange={handleFrameChange}
                className="mt-3 w-full cursor-pointer rounded-3xl border border-linen bg-cream px-5 py-4 text-ink outline-none transition hover:border-blush hover:premium-shadow focus:border-blush focus:ring-4 focus:ring-blush/20"
              >
                {frameOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </motion.div>
          </label>

          <label className="block">
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">
              Custom text
            </span>
            <input
              value={customText}
              onChange={(event) => setCustomText(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-linen bg-cream px-5 py-4 text-ink outline-none transition hover:border-blush hover:premium-shadow placeholder:text-cocoa/40 focus:border-blush focus:ring-4 focus:ring-blush/20"
              placeholder="Baby name, date, or family note"
            />
          </label>

          <div className="flex flex-col gap-4 rounded-[1.6rem] bg-gradient-to-br from-ink via-cocoa to-beige/80 p-5 text-cream premium-shadow ring-1 ring-white/15 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body text-sm font-medium uppercase text-cream/65">
                Estimated price
              </p>
              <motion.p
                className="mt-1 font-display text-4xl font-semibold leading-none"
                key={price}
                initial={{ opacity: 0.75, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                ₹{displayedPrice.toLocaleString('en-IN')}
              </motion.p>
            </div>
            <Button variant="soft" onClick={() => navigate('booking')} className="bg-cream">
              Request Appointment
            </Button>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(createEmptyContactForm);
  const [sent, setSent] = useState<boolean>(false);

  const update = (field: keyof ContactFormState, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
    setSent(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('Callback request:', form);
    setSent(true);
    setForm(createEmptyContactForm());
  };

  return (
    <SectionShell
      id="contact"
      eyebrow="Contact"
      title="Tell us about your little one"
      copy="Share a few details and we’ll call you back with calm guidance on designs, timing, and next steps."
      className="bg-gradient-to-b from-mistblue/70 to-cream organic-texture"
    >
      <motion.form
        onSubmit={submit}
        className="mx-auto grid max-w-4xl gap-4 rounded-[2.25rem] bg-gradient-to-br from-white/88 via-cream/80 to-mistblue/25 p-5 premium-shadow ring-1 ring-white sm:grid-cols-2 sm:p-7"
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <FormInput label="Name" value={form.name} onChange={(value) => update('name', value)} />
        <FormInput label="Phone" value={form.phone} onChange={(value) => update('phone', value)} />
        <FormInput label="City" value={form.city} onChange={(value) => update('city', value)} />
        <FormInput
          label="Baby age"
          value={form.babyAge}
          onChange={(value) => update('babyAge', value)}
          placeholder="2 months"
        />
        <label className="block sm:col-span-2">
          <span className="mb-2 block font-body text-sm font-semibold uppercase text-cocoa/60">
            Message
          </span>
          <textarea
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
            rows={4}
            className="w-full resize-none rounded-[1.4rem] border border-linen bg-cream px-5 py-4 text-ink outline-none transition placeholder:text-cocoa/40 focus:border-blush focus:ring-4 focus:ring-blush/20"
            placeholder="Any design idea, date, or special note"
          />
        </label>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit">Request Callback</Button>
          <AnimatePresence>
            {sent && (
              <motion.p
                className="rounded-full bg-petal px-4 py-2 font-body text-sm font-medium text-cocoa"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                Request received. We’ll call you shortly.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.form>
    </SectionShell>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required = label !== 'Baby age'
}: FormInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-sm font-semibold uppercase text-cocoa/60">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-full border border-linen bg-cream px-5 py-4 text-ink outline-none transition placeholder:text-cocoa/40 focus:border-blush focus:ring-4 focus:ring-blush/20"
        placeholder={placeholder || label}
      />
    </label>
  );
}

function HomePage({ navigate }: RouteProps) {
  return (
    <>
      <Hero navigate={navigate} />
      <GallerySection />
      <HowItWorks />
      <CustomizationPreview navigate={navigate} />
      <ContactForm />
    </>
  );
}

function DatePicker({ selectedDate, setSelectedDate }: DatePickerProps) {
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODate(today);
  const [monthDate, setMonthDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const days = getMonthDays(monthDate);
  const monthTitle = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-white/88 via-cream/80 to-petal/20 p-4 premium-shadow ring-1 ring-white sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={() =>
            setMonthDate(
              (currentMonth) =>
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
            )
          }
          className="grid h-11 w-11 place-items-center rounded-full bg-cream text-xl text-cocoa transition hover:bg-petal"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="text-center font-display text-2xl font-semibold leading-snug text-ink">
          {monthTitle}
        </h2>
        <button
          onClick={() =>
            setMonthDate(
              (currentMonth) =>
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            )
          }
          className="grid h-11 w-11 place-items-center rounded-full bg-cream text-xl text-cocoa transition hover:bg-petal"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-body text-xs font-semibold uppercase text-cocoa/55">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className="aspect-square" />;
          const iso = toISODate(date);
          const isPast = iso < todayISO;
          const isSelected = selectedDate === iso;

          return (
            <button
              key={iso}
              disabled={isPast}
              onClick={() => setSelectedDate(iso)}
              className={classNames(
                'aspect-square rounded-2xl text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush',
                isSelected && 'bg-ink text-cream shadow-soft',
                !isSelected && !isPast && 'bg-cream text-cocoa hover:bg-petal',
                isPast && 'cursor-not-allowed bg-linen/45 text-cocoa/25'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingPage() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(today));
  const [selectedSlot, setSelectedSlot] = useState<SlotId | ''>('');
  const [bookings, setBookings] = useState<BookingsByDate>(() => {
    const dayOne = toISODate(today);
    const dayTwo = toISODate(addDays(today, 1));
    const dayThree = toISODate(addDays(today, 3));

    const initialBookings: BookingsByDate = {
      [dayOne]: ['10-12', '4-6'],
      [dayTwo]: ['12-2', '6-8'],
      [dayThree]: ['2-4']
    };

    return initialBookings;
  });
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');

  const [showModal, setShowModal] = useState(false);

  const bookedForDate = bookings[selectedDate] || [];
  const selectedSlotLabel = selectedSlot
    ? slots.find((slot) => slot.id === selectedSlot)?.label ?? ''
    : '';
  const canConfirmBooking = Boolean(selectedDate && selectedSlot);

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedSlot('');
    setSuccess(false);
  };

  const confirmBooking = (): void => {
    const dateToBook = selectedDate;
    const slotToBook = selectedSlot;
    const slotLabel = selectedSlotLabel;

    if (!dateToBook || !slotToBook) return;
    setIsPaying(true);
    setNotice('');

    setTimeout(() => {
      setBookings((current) => ({
        ...current,
        [dateToBook]: [...(current[dateToBook] || []), slotToBook]
      }));
      const message = `New slot booked: ${formatDisplayDate(dateToBook)} + ${slotLabel}`;
      console.log(message);
      setNotice(message);
      setSuccess(true);
      setIsPaying(false);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-memory-glow organic-texture px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-10 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex rounded-full bg-white/65 px-4 py-2 font-body text-xs font-semibold uppercase text-cocoa premium-shadow ring-1 ring-white/80">
            Appointment
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
            Choose a calm time for your baby’s memory session
          </h1>
          <p className="mt-4 font-body text-lg font-light leading-8 text-cocoa/80">
            Pick a date, select an open two-hour slot, and reserve it with a simulated ₹500 booking
            fee.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.section
              key="success"
              className="mx-auto max-w-3xl rounded-[2.5rem] bg-gradient-to-br from-white/90 via-cream/85 to-petal/30 p-8 text-center premium-shadow ring-1 ring-white sm:p-12"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-petal text-4xl text-cocoa premium-shadow">
                ♥
              </div>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.16] text-ink">
                Your slot is confirmed! We’ll contact you shortly ❤️
              </h2>
              <div className="mx-auto mt-6 max-w-md rounded-[1.5rem] bg-cream p-5 text-left text-cocoa">
                <p className="font-body font-semibold">{formatDisplayDate(selectedDate)}</p>
                <p className="mt-1">{selectedSlotLabel}</p>
                <p className="mt-1">Booking fee: ₹500</p>
              </div>
              {notice && (
                <p className="mx-auto mt-5 max-w-lg rounded-full bg-mistblue px-4 py-2 font-body text-sm font-medium text-cocoa">
                  {notice}
                </p>
              )}
              <Button
                onClick={() => {
                  setSuccess(false);
                  setSelectedSlot('');
                  setNotice('');
                }}
                className="mt-8"
              >
                Book Another Slot
              </Button>
            </motion.section>
          ) : (
            <motion.section
              key="booking"
              className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <DatePicker selectedDate={selectedDate} setSelectedDate={handleDateChange} />

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-white/88 via-cream/80 to-mistblue/25 p-4 premium-shadow ring-1 ring-white sm:p-6">
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-body text-xs font-semibold uppercase text-cocoa/55">
                        Available slots
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">
                        {formatDisplayDate(selectedDate)}
                      </h2>
                    </div>
                    <p className="font-body text-sm font-medium text-cocoa/65">
                      Each session is 2 hours
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {slots.map((slot) => {
                      const booked = bookedForDate.includes(slot.id);
                      const selected = selectedSlot === slot.id;

                      return (
                        <motion.button
                          key={slot.id}
                          disabled={booked}
                          onClick={() => setSelectedSlot(slot.id)}
                          layout
                          animate={{ scale: selected ? 1.04 : 1 }}
                          whileHover={booked ? undefined : { y: -6, scale: selected ? 1.05 : 1.025 }}
                          whileTap={booked ? undefined : { scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                          className={classNames(
                            'rounded-[1.3rem] border p-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush',
                            selected &&
                            'border-blush/70 bg-gradient-to-br from-ink to-cocoa text-cream shadow-[0_24px_70px_rgba(111,81,66,0.28)] ring-4 ring-blush/30',
                            !selected &&
                            !booked &&
                            'border-linen bg-cream text-cocoa shadow-sm hover:border-blush hover:bg-white hover:premium-shadow',
                            booked &&
                            'cursor-not-allowed border-cocoa/5 bg-linen/55 text-cocoa/30 opacity-35 grayscale'
                          )}
                        >
                          <span className="block font-body text-lg font-semibold">
                            {slot.short}
                          </span>
                          <span className="mt-1 block font-body text-sm font-light">
                            {slot.label}
                          </span>
                          <span
                            className={classNames(
                              'mt-3 inline-flex rounded-full px-3 py-1 font-body text-xs font-semibold uppercase',
                              selected && 'bg-cream/95 text-ink premium-shadow',
                              !selected && !booked && 'bg-white/65 text-cocoa',
                              booked && 'bg-cocoa/10 text-cocoa/70'
                            )}
                          >
                            {booked ? 'Booked' : selected ? 'Selected' : 'Available'}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-gradient-to-br from-ink via-cocoa to-beige/80 p-5 text-cream premium-shadow ring-1 ring-white/15 sm:p-6 lg:-mt-2 lg:ml-4">
                  <p className="font-body text-xs font-semibold uppercase text-cream/60">
                    Summary
                  </p>
                  <div className="mt-4 space-y-3 font-body text-base font-light leading-7">
                    <p>
                      <span className="text-cream/60">Selected date:</span>{' '}
                      {selectedDate ? formatDisplayDate(selectedDate) : 'Choose a date'}
                    </p>
                    <p>
                      <span className="text-cream/60">Selected slot:</span>{' '}
                      {selectedSlotLabel || 'Choose a slot'}
                    </p>
                    <p>
                      <span className="text-cream/60">Booking fee:</span> ₹500
                    </p>
                  </div>
                  <Button
                    variant="soft"
                    disabled={!canConfirmBooking}
                    onClick={() => setShowModal(true)}
                  >
                    Continue Booking
                  </Button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <BookingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        selectedDate={formatDisplayDate(selectedDate)}
        selectedSlot={selectedSlotLabel}
        onConfirm={() => {
          confirmBooking();
          setShowModal(false);
        }}
        isPaying={isPaying}
      />
    </main>
  );
}

function ProductsPage() {
  const [notice, setNotice] = useState<string>('');

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream via-petal/55 to-mistblue/70 organic-texture px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 font-body text-xs font-semibold uppercase text-cocoa premium-shadow ring-1 ring-white">
            Coming Soon
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
            Something Special is Coming ✨
          </h1>
          <p className="mt-4 font-body text-lg font-light leading-8 text-cocoa/80">
            We are working on a range of customizable products for your special moments. Stay
            tuned!
          </p>
          <Button
            onClick={() => setNotice('You’re on the list. We’ll share the soft launch first.')}
            className="mt-7"
          >
            Notify Me
          </Button>
          <AnimatePresence>
            {notice && (
              <motion.p
                className="mx-auto mt-4 inline-flex rounded-full bg-white/80 px-4 py-2 font-body text-sm font-medium text-cocoa premium-shadow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                {notice}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {productCards.map((product, index) => (
            <motion.article
              key={product.title}
              className={classNames(
                'group overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-petal/25 to-mistblue/30 p-[1px] premium-shadow ring-1 ring-white/85',
                productDepthOffsets[index % productDepthOffsets.length]
              )}
              variants={fadeIn}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <div className="rounded-[1.95rem] bg-white/88 p-3 soft-grain">
                <div className="relative overflow-hidden rounded-[1.5rem] premium-shadow">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-ink/88 px-3 py-1 font-body text-xs font-semibold uppercase text-cream backdrop-blur">
                    Coming Soon
                  </span>
                </div>
                <div className="px-2 pb-3 pt-5">
                  <h2 className="font-display text-2xl font-semibold leading-snug text-ink">
                    {product.title}
                  </h2>
                  <p className="mt-3 font-body text-sm font-light leading-6 text-cocoa/75">
                    {product.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

export default function App() {
  const [route, navigate] = useHashRoute();
  const page: Route = route;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Navbar route={page} navigate={navigate} />
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {page === 'home' && <HomePage navigate={navigate} />}
          {page === 'booking' && <BookingPage />}
          {page === 'products' && <ProductsPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
