import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { galleryItems, timelineSteps } from '../data';
import { addDays, classNames, formatDisplayDate, getMonthDays, toISODate } from '../utils';
import Button from '../components/UI/Button';
import SectionShell from '../components/UI/SectionShell';
import FormInput from '../components/UI/FormInput';
import { useNavigate } from 'react-router-dom';

const heroText = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.08 } }
};

const heroTextItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75 } }
};

const impressionOptions = ['hands', 'feet', 'both'] as const;
type ImpressionType = (typeof impressionOptions)[number];

const frameOptions = ['Classic Cream', 'Blush Gold', 'Baby Blue LED', 'Premium Shadow Box'] as const;
type FrameStyle = (typeof frameOptions)[number];

const impressionPrices: Record<ImpressionType, number> = { hands: 600, feet: 600, both: 1100 };
const framePrices: Record<FrameStyle, number> = { 'Classic Cream': 1600, 'Blush Gold': 2200, 'Baby Blue LED': 3200, 'Premium Shadow Box': 3800 };

const framePreviewStyles: Record<FrameStyle, any> = {
  'Classic Cream': { shell: 'from-cream via-white to-linen', mat: 'bg-cream/85 border-beige/35', accent: 'bg-white text-cocoa', line: 'bg-beige/55' },
  'Blush Gold': { shell: 'from-petal via-cream to-blush/60', mat: 'bg-petal/60 border-blush/50', accent: 'bg-white text-cocoa', line: 'bg-blush/70' },
  'Baby Blue LED': { shell: 'from-mistblue via-white to-babyblue/60', mat: 'bg-mistblue/70 border-babyblue/60', accent: 'bg-white text-ink shadow-[0_0_28px_rgba(185,221,244,0.75)]', line: 'bg-babyblue/80' },
  'Premium Shadow Box': { shell: 'from-ink via-cocoa to-beige', mat: 'bg-cream/90 border-white/50', accent: 'bg-ink text-cream', line: 'bg-cocoa/55' }
};

const impressionPreviews: Record<ImpressionType, any> = {
  hands: { label: 'Tiny hands', description: 'Hand impression focus', marks: ['Palm', 'Fingers'] },
  feet: { label: 'Tiny feet', description: 'Foot impression focus', marks: ['Heel', 'Toes'] },
  both: { label: 'Hands and feet', description: 'Complete impression set', marks: ['Palm', 'Toes', 'Heel'] }
};

const galleryDepthOffsets = ['lg:mt-0', 'sm:mt-8 lg:mt-12', 'sm:-mt-2 lg:-mt-4', 'sm:mt-6 lg:mt-10', 'sm:-mt-1 lg:-mt-5', 'sm:mt-10 lg:mt-14'];

function useAnimatedNumber(value: number): number {
  const previousValue = useRef<number>(value);
  const [displayedValue, setDisplayedValue] = useState<number>(value);

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration: 0.65,
      onUpdate: (latestValue) => setDisplayedValue(Math.round(latestValue))
    });

    previousValue.current = value;
    return () => controls.stop();
  }, [value]);

  return displayedValue;
}

function Hero() {
  const navigate = useNavigate();
  const scrollToPreview = (): void => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[#fff8f2] px-5 py-12 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,248,237,0.72)_0%,rgba(252,232,238,0.38)_42%,rgba(233,247,255,0.5)_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream/65 via-cream/10 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div className="pt-10 sm:pt-16 lg:pt-20" variants={heroText} initial="hidden" animate="show">
          <motion.span className="inline-flex rounded-full bg-white/65 px-4 py-2 font-body text-xs font-semibold uppercase text-cocoa premium-shadow ring-1 ring-white/80" variants={heroTextItem}>
            Baby impressions and memory frames
          </motion.span>
          <motion.h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.06] text-ink sm:text-6xl lg:text-7xl" variants={heroTextItem}>
            Before they grow... hold onto this moment forever.
          </motion.h1>
          <motion.p className="mt-6 max-w-2xl font-body text-lg font-light leading-8 text-cocoa/85 sm:text-xl sm:leading-9" variants={heroTextItem}>
            We preserve your baby's tiniest details into timeless 3D keepsakes.
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={heroTextItem}>
            <Button onClick={scrollToPreview} className="premium-shadow sm:px-8">Create Your Memory</Button>
            <Button variant="soft" onClick={() => navigate('/booking')} className="sm:px-8">Book Appointment</Button>
          </motion.div>
        </motion.div>

        <motion.div className="relative pb-8 lg:pb-0" initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.85 }}>
          <div className="absolute -left-4 top-12 h-32 w-32 rounded-full bg-blush/35 blur-3xl" />
          <div className="absolute -right-2 bottom-8 h-40 w-40 rounded-full bg-babyblue/40 blur-3xl" />
          <div className="relative mx-auto max-w-md rounded-[2.5rem] bg-gradient-to-br from-white/80 via-petal/30 to-mistblue/45 p-3 premium-shadow ring-1 ring-white/80 sm:max-w-lg">
            <div className="overflow-hidden rounded-[2rem] premium-shadow">
              <motion.img src="https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1000&q=90" alt="Newborn baby memory moment" className="h-[460px] w-full object-cover sm:h-[560px]" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} />
            </div>
            <motion.div className="absolute -bottom-4 left-5 right-5 rounded-[1.7rem] bg-cream/90 p-4 premium-shadow backdrop-blur" animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}>
              <p className="font-display text-xl font-semibold leading-snug text-ink">First-touch keepsakes</p>
              <p className="mt-1 font-body text-sm font-light leading-6 text-cocoa/75">Soft 3D impressions, personal text, and frame finishes chosen around your baby.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <SectionShell id="gallery" eyebrow="Gallery" title="Tiny hands, soft feet, big feelings" copy="A quiet collection of pastel keepsakes, family frames, and premium LED memories designed for newborn stories." className="bg-cream organic-texture">
      <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
        {galleryItems.map((item, index) => (
          <motion.article key={item.title} className={classNames('group overflow-hidden rounded-[2rem] bg-white p-[1px] premium-shadow ring-1 ring-white/80', galleryDepthOffsets[index % galleryDepthOffsets.length])} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
            <div className="rounded-[1.95rem] bg-white/88 p-3">
              <div className="overflow-hidden rounded-[1.55rem] premium-shadow">
                <img src={item.image} alt={item.title} className="h-72 w-full object-cover transition duration-700 group-hover:scale-110" />
              </div>
              <div className="px-2 pb-3 pt-5">
                <p className="font-body text-xs font-semibold uppercase text-cocoa/55">{item.category}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">{item.title}</h3>
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
    <SectionShell id="how-it-works" eyebrow="How it works" title="A gentle path from first hello to finished frame" copy="Every keepsake begins with your baby’s story and moves at a pace that feels calm, clear, and personal." className="bg-gradient-to-b from-petal/60 via-cream to-mistblue/70 organic-texture">
      <div className="relative mx-auto max-w-5xl">
        <motion.div className="absolute left-7 top-8 h-[calc(100%-4rem)] w-px origin-top bg-gradient-to-b from-blush via-beige to-babyblue" initial={{ scaleY: 0, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={{ once: true, amount: 0.28 }} transition={{ duration: 1.35 }} aria-hidden="true" />
        <div className="space-y-8 sm:space-y-10">
          {timelineSteps.map((step, index) => (
            <motion.article key={step.title} className={classNames('group relative grid min-h-[42vh] grid-cols-[4rem_1fr] content-center gap-4 rounded-[2rem] soft-card p-5 premium-shadow ring-1 ring-white/90 backdrop-blur transition-shadow duration-300 hover:premium-shadow sm:min-h-[46vh] md:grid-cols-[5rem_1fr] md:p-7', index % 2 === 0 ? 'md:mr-6' : 'md:ml-6')} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.55, margin: '0px 0px -12% 0px' }} variants={{ hidden: { opacity: 0, x: -24, y: 34, scale: 0.97 }, show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.75 } } }} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 230, damping: 24 }}>
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush to-babyblue font-display text-2xl text-ink premium-shadow ring-8 ring-white/75 transition-transform duration-300 group-hover:scale-105">{step.icon}</div>
              <div className="pt-0.5">
                <p className="font-body text-sm font-semibold uppercase text-cocoa/55">Step {index + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-3 font-body font-light leading-7 text-cocoa/78">{step.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function CustomizationPreview() {
  const navigate = useNavigate();
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
  const memberMarkers = useMemo<number[]>(() => Array.from({ length: members }, (_, index) => index + 1), [members]);

  const handleFrameChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextFrame = event.target.value as FrameStyle;
    setFrame(nextFrame);
  };

  return (
    <SectionShell id="customize" eyebrow="Preview" title="Shape the memory before we make it" copy="Try a simple mock configuration and see how your keepsake estimate changes." className="bg-cream organic-texture">
      <motion.div className="grid gap-6 rounded-[2.25rem] bg-gradient-to-br from-white/88 via-petal/15 to-mistblue/20 p-4 premium-shadow ring-1 ring-white/85 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8" variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.div className={classNames('rounded-[1.75rem] bg-gradient-to-br p-5 premium-shadow transition-colors duration-500 sm:p-6 lg:-mt-3', framePreview.shell)} animate={{ scale: [1, 1.012, 1] }} transition={{ duration: 0.45 }}>
          <motion.div className="aspect-[4/5] rounded-[1.4rem] bg-white/72 p-4 premium-shadow transition-shadow duration-500" whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
            <div className={classNames('grid h-full place-items-center overflow-hidden rounded-[1.1rem] border border-dashed text-center transition-colors duration-500', framePreview.mat)}>
              <div className="w-full px-4">
                <motion.div className={classNames('mx-auto grid h-28 w-28 place-items-center rounded-full text-4xl shadow-soft transition-colors duration-500', framePreview.accent)} key={`${frame}-${impression}`} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>♥</motion.div>

                <div className="mx-auto mt-5 flex max-w-xs justify-center gap-2">
                  <AnimatePresence mode="popLayout">
                    {impressionPreview.marks.map((mark: string) => (
                      <motion.span key={mark} className="rounded-full bg-white/80 px-3 py-1 font-body text-xs font-semibold text-cocoa shadow-sm" initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.9 }} transition={{ duration: 0.25 }}>{mark}</motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.p className="mt-4 font-display text-3xl font-semibold leading-snug text-ink" key={frame} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{frame}</motion.p>
                <motion.p className="mt-2 font-body text-sm font-medium uppercase text-cocoa/55" key={`${members}-${impression}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>{members} member{members > 1 ? 's' : ''} · {impressionPreview.label}</motion.p>

                <div className="mx-auto mt-4 flex max-w-[13rem] flex-wrap justify-center gap-1.5">
                  <AnimatePresence mode="popLayout">
                    {memberMarkers.map((marker) => (
                      <motion.span key={marker} className={classNames('h-2.5 w-2.5 rounded-full', framePreview.line)} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 20 }} />
                    ))}
                  </AnimatePresence>
                </div>

                <motion.p className="mx-auto mt-4 max-w-xs font-body text-lg font-light leading-7 text-cocoa/85" key={customText} initial={{ opacity: 0.55 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>“{customText}”</motion.p>
                <p className="mt-3 font-body text-xs font-medium text-cocoa/55">{impressionPreview.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="space-y-6 rounded-[1.75rem] bg-white/35 p-1 soft-grain sm:p-2 lg:translate-y-3">
          <label className="block">
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">Number of members</span>
            <div className="mt-3 flex items-center gap-4">
              <motion.div className="w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <input type="range" min="1" max="7" value={members} onChange={(event) => setMembers(Number(event.target.value))} className="w-full cursor-pointer accent-cocoa transition-opacity hover:opacity-90" />
              </motion.div>
              <motion.span key={members} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-petal font-body font-semibold text-ink premium-shadow" initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>{members}</motion.span>
            </div>
          </label>

          <div>
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">Impression type</span>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-3xl bg-cream p-1">
              {impressionOptions.map((type) => (
                <motion.button key={type} onClick={() => setImpression(type)} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.96 }} animate={{ scale: impression === type ? 1.04 : 1 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }} className={classNames('rounded-full px-3 py-3 text-sm font-semibold capitalize transition-colors', impression === type ? 'bg-ink text-cream shadow-soft ring-4 ring-blush/20' : 'text-cocoa hover:bg-white hover:premium-shadow')}>
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">Frame style</span>
            <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 240 }}>
              <select value={frame} onChange={handleFrameChange} className="mt-3 w-full cursor-pointer rounded-3xl border border-linen bg-cream px-5 py-4 text-ink outline-none transition hover:border-blush hover:premium-shadow focus:border-blush focus:ring-4 focus:ring-blush/20">
                {frameOptions.map((option) => (<option key={option}>{option}</option>))}
              </select>
            </motion.div>
          </label>

          <label className="block">
            <span className="font-body text-sm font-semibold uppercase text-cocoa/60">Custom text</span>
            <input value={customText} onChange={(event) => setCustomText(event.target.value)} className="mt-3 w-full rounded-3xl border border-linen bg-cream px-5 py-4 text-ink outline-none transition hover:border-blush hover:premium-shadow placeholder:text-cocoa/40 focus:border-blush focus:ring-4 focus:ring-blush/20" placeholder="Baby name, date, or family note" />
          </label>

          <div className="flex flex-col gap-4 rounded-[1.6rem] bg-gradient-to-br from-ink via-cocoa to-beige/80 p-5 text-cream premium-shadow ring-1 ring-white/15 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body text-sm font-medium uppercase text-cream/65">Estimated price</p>
              <motion.p className="mt-1 font-display text-4xl font-semibold leading-none" key={price} initial={{ opacity: 0.75, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>₹{displayedPrice.toLocaleString('en-IN')}</motion.p>
            </div>
            <Button variant="soft" onClick={() => navigate('/booking')} className="bg-cream">Request Appointment</Button>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', babyAge: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSent(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Callback request:', form);
    setSent(true);
    setForm({ name: '', phone: '', city: '', babyAge: '', message: '' });
  };

  return (
    <SectionShell id="contact" eyebrow="Contact" title="Tell us about your little one" copy="Share a few details and we’ll call you back with calm guidance on designs, timing, and next steps." className="bg-gradient-to-b from-mistblue/70 to-cream organic-texture">
      <motion.form onSubmit={submit} className="mx-auto grid max-w-4xl gap-4 rounded-[2.25rem] bg-gradient-to-br from-white/88 via-cream/80 to-mistblue/25 p-5 premium-shadow ring-1 ring-white sm:grid-cols-2 sm:p-7" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <FormInput label="Name" value={form.name} onChange={(value) => update('name', value)} />
        <FormInput label="Phone" value={form.phone} onChange={(value) => update('phone', value)} />
        <FormInput label="City" value={form.city} onChange={(value) => update('city', value)} />
        <FormInput label="Baby age" value={form.babyAge} onChange={(value) => update('babyAge', value)} placeholder="2 months" />
        <label className="block sm:col-span-2">
          <span className="mb-2 block font-body text-sm font-semibold uppercase text-cocoa/60">Message</span>
          <textarea value={form.message} onChange={(event) => update('message', event.target.value)} rows={4} className="w-full resize-none rounded-[1.4rem] border border-linen bg-cream px-5 py-4 text-ink outline-none transition placeholder:text-cocoa/40 focus:border-blush focus:ring-4 focus:ring-blush/20" placeholder="Any design idea, date, or special note" />
        </label>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit">Request Callback</Button>
          <AnimatePresence>
            {sent && (
              <motion.p className="rounded-full bg-petal px-4 py-2 font-body text-sm font-medium text-cocoa" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>Request received. We’ll call you shortly.</motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.form>
    </SectionShell>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <GallerySection />
      <HowItWorks />
      <CustomizationPreview />
      <ContactForm />
    </>
  );
}
