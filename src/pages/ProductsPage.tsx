import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productCards } from '../data';
import Button from '../components/UI/Button';

export default function ProductsPage() {
  const [notice, setNotice] = useState('');

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream via-petal/55 to-mistblue/70 organic-texture px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div className="mx-auto mb-10 max-w-3xl text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex rounded-full bg-white/70 px-4 py-2 font-body text-xs font-semibold uppercase text-cocoa premium-shadow ring-1 ring-white">Coming Soon</span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-ink sm:text-5xl lg:text-6xl">Something Special is Coming ✨</h1>
          <p className="mt-4 font-body text-lg font-light leading-8 text-cocoa/80">We are working on a range of customizable products for your special moments. Stay tuned!</p>
          <Button onClick={() => setNotice('You’re on the list. We’ll share the soft launch first.')} className="mt-7">Notify Me</Button>
          <AnimatePresence>
            {notice && (
              <motion.p className="mx-auto mt-4 inline-flex rounded-full bg-white/80 px-4 py-2 font-body text-sm font-medium text-cocoa premium-shadow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>{notice}</motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }} initial="hidden" animate="show">
          {productCards.map((product, index) => (
            <motion.article key={product.title} className={`group overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-petal/25 to-mistblue/30 p-[1px] premium-shadow ring-1 ring-white/85`} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65 } } }} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
              <div className="rounded-[1.95rem] bg-white/88 p-3 soft-grain">
                <div className="relative overflow-hidden rounded-[1.5rem] premium-shadow">
                  <img src={product.image} alt={product.title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute right-3 top-3 rounded-full bg-ink/88 px-3 py-1 font-body text-xs font-semibold uppercase text-cream backdrop-blur">Coming Soon</span>
                </div>
                <div className="px-2 pb-3 pt-5">
                  <h2 className="font-display text-2xl font-semibold leading-snug text-ink">{product.title}</h2>
                  <p className="mt-3 font-body text-sm font-light leading-6 text-cocoa/75">{product.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
