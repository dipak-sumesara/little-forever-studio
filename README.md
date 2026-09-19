# Little Forever Studio

Site for a keepsake studio that casts babies' hand and foot impressions into framed pieces. Three views — memories, appointment booking, and custom products — built as an animated single-page React app with a booking calendar and a live price configurator.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS 3 · Framer Motion · Razorpay Checkout

---

## Features

**Appointment booking**

- A calendar built from scratch (`getMonthDays` lays out leading blanks and month days; `addDays`, `toISODate`, and a locale-aware `formatDisplayDate` handle the rest) rather than pulling in a date library
- Five fixed daily slots, with per-date availability so already-taken slots are shown as unavailable
- A booking modal that collects contact details and distinguishes local from out-of-city customers, adjusting the address fields accordingly
- A ₹500 booking fee taken through Razorpay Checkout, with the key supplied via `VITE_RAZORPAY_KEY`

**Custom product configurator**

Impression type (hands, feet, or both) and frame style (Classic Cream, Blush Gold, Baby Blue LED, Premium Shadow Box) each carry a price, and the total updates as the selection changes — so a visitor sees the cost of their configuration before enquiring.

**Presentation**

- Hash-based routing (`#/home`, `#/booking`, `#/products`) with `hashchange` handling, so views are linkable and the back button works without a router dependency
- Framer Motion throughout: staggered hero text, scroll-revealed sections, an animated process timeline, and modal enter/exit transitions
- A gallery and a step-by-step "how it works" timeline driven from a single `data.ts`
- Typed end to end — routes, slots, impression types, frame styles, and form state are all union types in `types.ts`, so an invalid slot or frame is a compile error

---

## Project structure

```
src/
  App.tsx                       views, routing, calendar, configurator
  components/booking/
    BookingModal.tsx            booking form + Razorpay checkout
  data.ts                       gallery, products, slots, timeline content
  types.ts                      Route, SlotId, ImpressionType, FrameStyle, form state
  utils.ts                      date helpers and class-name composition
```

Content lives in `data.ts` and the domain vocabulary in `types.ts`, so adding a product or a slot is a data change rather than a component change.

---

## Running locally

```bash
npm install
cp .env.example .env    # VITE_RAZORPAY_KEY
npm run dev
```

```bash
npm run typecheck       # tsc --noEmit
npm run build           # type-checks, then builds
npm run preview
```

The build runs `tsc --noEmit` before Vite, so a type error fails the build rather than shipping.

---

## Status and limitations

A front-end project with no server behind it:

- **No backend.** Bookings and enquiries are not persisted, and slot availability is defined in the client — two visitors can book the same slot.
- **Payments are test-mode and unverified.** Razorpay's success handler is trusted client-side; production requires server-side order creation and signature verification, since a client-reported success proves nothing.
- **Content is static.** Gallery, products, and prices are in `data.ts`, with no CMS.

## Possible next steps

- An API for bookings, with server-side slot locking and Razorpay order creation plus signature verification
- Email or WhatsApp confirmation on a verified payment
- A CMS or admin view for gallery and pricing
- Image optimisation and responsive sources for the gallery

---

## License

MIT
