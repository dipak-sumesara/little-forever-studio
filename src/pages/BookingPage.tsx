import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { slots } from '../data';
import { toISODate, addDays, formatDisplayDate, getMonthDays } from '../utils';
import BookingModal from '../components/booking/BookingModal';

function DatePicker({ selectedDate, setSelectedDate }: { selectedDate: string; setSelectedDate: (d: string) => void }) {
  const today = useMemo(() => new Date(), []);
  const todayISO = toISODate(today);
  const [monthDate, setMonthDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const days = getMonthDays(monthDate);
  const monthTitle = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-white/88 via-cream/80 to-petal/20 p-4 premium-shadow ring-1 ring-white sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button onClick={() => setMonthDate((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-xl text-cocoa transition hover:bg-petal" aria-label="Previous month">‹</button>
        <h2 className="text-center font-display text-2xl font-semibold leading-snug text-ink">{monthTitle}</h2>
        <button onClick={() => setMonthDate((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-xl text-cocoa transition hover:bg-petal" aria-label="Next month">›</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-body text-xs font-semibold uppercase text-cocoa/55">
        {weekdays.map((weekday) => (<span key={weekday}>{weekday}</span>))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className="aspect-square" />;
          const iso = toISODate(date);
          const isPast = iso < todayISO;
          const isSelected = selectedDate === iso;

          return (
            <button key={iso} disabled={isPast} onClick={() => setSelectedDate(iso)} className={`aspect-square rounded-2xl text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush ${isSelected ? 'bg-ink text-cream shadow-soft' : !isPast ? 'bg-cream text-cocoa hover:bg-petal' : 'cursor-not-allowed bg-linen/45 text-cocoa/25'}`}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingPage() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(today));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookings, setBookings] = useState(() => {
    const dayOne = toISODate(today);
    const dayTwo = toISODate(addDays(today, 1));
    const dayThree = toISODate(addDays(today, 3));

    return {
      [dayOne]: ['10-12', '4-6'],
      [dayTwo]: ['12-2', '6-8'],
      [dayThree]: ['2-4']
    } as Record<string, string[]>;
  });
  const [isPaying, setIsPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notice, setNotice] = useState('');
  const [showModal, setShowModal] = useState(false);

  const bookedForDate = bookings[selectedDate] || [];
  const selectedSlotLabel = selectedSlot ? slots.find((slot) => slot.id === selectedSlot)?.label ?? '' : '';
  const canConfirmBooking = Boolean(selectedDate && selectedSlot);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setSuccess(false);
  };

  const confirmBooking = () => {
    const dateToBook = selectedDate;
    const slotToBook = selectedSlot;
    const slotLabel = selectedSlotLabel;

    if (!dateToBook || !slotToBook) return;
    setIsPaying(true);
    setNotice('');

    setTimeout(() => {
      setBookings((current) => ({ ...current, [dateToBook]: [...(current[dateToBook] || []), slotToBook] }));
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
        <motion.div className="mb-10 max-w-3xl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex rounded-full bg-white/65 px-4 py-2 font-body text-xs font-semibold uppercase text-cocoa premium-shadow ring-1 ring-white/80">Appointment</span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.12] text-ink sm:text-5xl lg:text-6xl">Choose a calm time for your baby’s memory session</h1>
          <p className="mt-4 font-body text-lg font-light leading-8 text-cocoa/80">Pick a date, select an open two-hour slot, and reserve it with a simulated ₹500 booking fee.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.section key="success" className="mx-auto max-w-3xl rounded-[2.5rem] bg-gradient-to-br from-white/90 via-cream/85 to-petal/30 p-8 text-center premium-shadow ring-1 ring-white sm:p-12" initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-petal text-4xl text-cocoa premium-shadow">♥</div>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.16] text-ink">Your slot is confirmed! We’ll contact you shortly ❤️</h2>
              <div className="mx-auto mt-6 max-w-md rounded-[1.5rem] bg-cream p-5 text-left text-cocoa">
                <p className="font-body font-semibold">{formatDisplayDate(selectedDate)}</p>
                <p className="mt-1">{selectedSlotLabel}</p>
                <p className="mt-1">Booking fee: ₹500</p>
              </div>
              {notice && (<p className="mx-auto mt-5 max-w-lg rounded-full bg-mistblue px-4 py-2 font-body text-sm font-medium text-cocoa">{notice}</p>)}
            </motion.section>
          ) : (
            <motion.section key="booking" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <DatePicker selectedDate={selectedDate} setSelectedDate={handleDateChange} />

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-white/88 via-cream/80 to-mistblue/25 p-4 premium-shadow ring-1 ring-white sm:p-6">
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-body text-xs font-semibold uppercase text-cocoa/55">Available slots</p>
                      <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">{formatDisplayDate(selectedDate)}</h2>
                    </div>
                    <p className="font-body text-sm font-medium text-cocoa/65">Each session is 2 hours</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {slots.map((slot) => {
                      const booked = bookedForDate.includes(slot.id);
                      const selected = selectedSlot === slot.id;

                      return (
                        <motion.button key={slot.id} disabled={booked} onClick={() => setSelectedSlot(slot.id)} layout animate={{ scale: selected ? 1.04 : 1 }} whileHover={booked ? undefined : { y: -6, scale: selected ? 1.05 : 1.025 }} whileTap={booked ? undefined : { scale: 0.98 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className={`rounded-[1.3rem] border p-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush ${selected ? 'border-blush/70 bg-gradient-to-br from-ink to-cocoa text-cream shadow-[0_24px_70px_rgba(111,81,66,0.28)] ring-4 ring-blush/30' : !booked ? 'border-linen bg-cream text-cocoa shadow-sm hover:border-blush hover:bg-white hover:premium-shadow' : 'cursor-not-allowed border-cocoa/5 bg-linen/55 text-cocoa/30 opacity-35 grayscale'}`}>
                          <span className="block font-body text-lg font-semibold">{slot.short}</span>
                          <span className="mt-1 block font-body text-sm font-light">{slot.label}</span>
                          <span className={`mt-3 inline-flex rounded-full px-3 py-1 font-body text-xs font-semibold uppercase ${selected ? 'bg-cream/95 text-ink premium-shadow' : !booked ? 'bg-white/65 text-cocoa' : 'bg-cocoa/10 text-cocoa/70'}`}>{booked ? 'Booked' : selected ? 'Selected' : 'Available'}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-gradient-to-br from-ink via-cocoa to-beige/80 p-5 text-cream premium-shadow ring-1 ring-white/15 sm:p-6 lg:-mt-2 lg:ml-4">
                  <p className="font-body text-xs font-semibold uppercase text-cream/60">Summary</p>
                  <div className="mt-4 space-y-3 font-body text-base font-light leading-7">
                    <p><span className="text-cream/60">Selected date:</span> {selectedDate ? formatDisplayDate(selectedDate) : 'Choose a date'}</p>
                    <p><span className="text-cream/60">Selected slot:</span> {selectedSlotLabel || 'Choose a slot'}</p>
                    <p><span className="text-cream/60">Booking fee:</span> ₹500</p>
                  </div>
                  <button disabled={!canConfirmBooking} onClick={() => setShowModal(true)} className="mt-4 rounded-full bg-white/75 px-6 py-3 text-sm font-semibold">Continue Booking</button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <BookingModal open={showModal} onClose={() => setShowModal(false)} selectedDate={formatDisplayDate(selectedDate)} selectedSlot={selectedSlot ? slots.find((s) => s.id === selectedSlot)?.label ?? '' : ''} onConfirm={() => { confirmBooking(); setShowModal(false); }} isPaying={isPaying} />
    </main>
  );
}
