import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface BookingModalProps {
    open: boolean;
    onClose: () => void;
    selectedDate: string;
    selectedSlot: string;
    onConfirm: () => void;
    isPaying: boolean;
}

interface BookingForm {
    mobile: string;
    name: string;
    locationType: 'ahmedabad' | 'other';
    city: string;
    address: string;
}

export default function BookingModal({
    open,
    onClose,
    selectedDate,
    selectedSlot,
    onConfirm,
    isPaying
}: BookingModalProps) {
    const [form, setForm] = useState<BookingForm>({
        mobile: '',
        name: '',
        locationType: 'ahmedabad',
        city: '',
        address: ''
    });

    const [checkingUser, setCheckingUser] = useState(false);
    const [userChecked, setUserChecked] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const handlePayment = async () => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,

            amount: 500 * 100,

            currency: 'INR',

            name: 'Tiny Memories',

            description: 'Appointment Booking Fee',

            handler: function (response: any) {
                console.log('Payment Success:', response);

                onConfirm();
            },

            prefill: {
                name: form.name,
                contact: form.mobile,
                email: 'test@example.com'
            },

            notes: {
                customerName: form.name,
                mobile: form.mobile
            },

            theme: {
                color: '#6f5142'
            },

            method: {
                upi: true,
                card: true,
                netbanking: false,
                wallet: false,
                emi: false,
                paylater: false
            }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();
    };

    useEffect(() => {
        if (form.mobile.length === 10) {
            setCheckingUser(true);
            setUserChecked(false);

            const timeout = setTimeout(() => {
                const existingUser = form.mobile.endsWith('5');

                if (existingUser) {
                    setForm((prev) => ({
                        ...prev,
                        name: 'Priya Shah',
                        city: 'Ahmedabad',
                        address: 'Satellite, Ahmedabad'
                    }));

                    setWelcomeMessage(
                        'Welcome back ❤️ We filled your previous details for convenience.'
                    );
                } else {
                    setWelcomeMessage(
                        'Looks like you are a new user ✨ Welcome aboard.'
                    );
                }

                setCheckingUser(false);
                setUserChecked(true);
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [form.mobile]);

    const updateField = (key: keyof BookingForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 px-4 py-10 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="flex min-h-full items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-cocoa/60">
                                    Appointment Details
                                </p>

                                <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                                    Complete Your Booking
                                </h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="grid h-10 w-10 place-items-center rounded-full bg-cream text-xl text-cocoa"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-6 rounded-2xl bg-cream p-4 text-sm text-cocoa">
                            <p>
                                <span className="font-semibold">Date:</span> {selectedDate}
                            </p>

                            <p className="mt-1">
                                <span className="font-semibold">Slot:</span> {selectedSlot}
                            </p>

                            <p className="mt-1">
                                <span className="font-semibold">Booking Fee:</span> ₹500
                            </p>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-cocoa">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    value={form.mobile}
                                    onChange={(e) => updateField('mobile', e.target.value)}
                                    placeholder="Enter mobile number"
                                    className="w-full rounded-2xl border border-linen bg-cream px-4 py-4 outline-none transition focus:border-blush"
                                />
                            </div>

                            {checkingUser && (
                                <div className="rounded-2xl bg-mistblue/40 p-4 text-sm text-cocoa">
                                    Checking your details...
                                </div>
                            )}

                            {userChecked && (
                                <div className="rounded-2xl bg-petal/40 p-4 text-sm text-cocoa">
                                    {welcomeMessage}
                                </div>
                            )}

                            <div>
                                <label className="mb-3 block text-sm font-semibold text-cocoa">
                                    Where are you located?
                                </label>

                                <div className="flex rounded-2xl bg-cream p-1">
                                    <button
                                        type="button"
                                        onClick={() => updateField('locationType', 'ahmedabad')}
                                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${form.locationType === 'ahmedabad'
                                            ? 'bg-ink text-white'
                                            : 'text-cocoa'
                                            }`}
                                    >
                                        Ahmedabad
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateField('locationType', 'other')}
                                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${form.locationType === 'other'
                                            ? 'bg-ink text-white'
                                            : 'text-cocoa'
                                            }`}
                                    >
                                        Other City
                                    </button>
                                </div>

                                <p className="mt-2 text-sm text-cocoa/70">
                                    {form.locationType === 'ahmedabad'
                                        ? '✨ We currently provide home visits across Ahmedabad.'
                                        : '✨ We’ll coordinate everything with you personally.'}
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-cocoa">
                                    Full Name
                                </label>

                                <input
                                    value={form.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Your name"
                                    className="w-full rounded-2xl border border-linen bg-cream px-4 py-4 outline-none transition focus:border-blush"
                                />
                            </div>

                            {form.locationType === 'other' && (
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-cocoa">
                                        City
                                    </label>

                                    <input
                                        value={form.city}
                                        onChange={(e) => updateField('city', e.target.value)}
                                        placeholder="Your city"
                                        className="w-full rounded-2xl border border-linen bg-cream px-4 py-4 outline-none transition focus:border-blush"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-cocoa">
                                    Address
                                </label>

                                <textarea
                                    rows={3}
                                    value={form.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    placeholder="Your address"
                                    className="w-full rounded-2xl border border-linen bg-cream px-4 py-4 outline-none transition focus:border-blush"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isPaying || checkingUser}
                            onClick={handlePayment}
                            className="mt-6 w-full rounded-2xl bg-ink px-5 py-4 text-white transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPaying ? 'Processing...' : 'Confirm & Pay ₹500'}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}