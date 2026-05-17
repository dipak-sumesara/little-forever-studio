import { motion } from 'framer-motion';
import { classNames } from '../../utils';

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  copy?: string;
  children?: React.ReactNode;
  className?: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65 } }
};

export default function SectionShell({ id, eyebrow, title, copy, children, className }: SectionShellProps) {
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
