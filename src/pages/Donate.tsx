import { useState } from 'react';
import {
  Heart,
  Smartphone,
  Check,
  Copy,
  CheckCheck,
  ExternalLink,
  Building2,
  Shield,
  ArrowRight,
} from 'lucide-react';
import TiltCard from '../components/TiltCard';

const copyToClipboard = async (val: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(val);
      return true;
    }
    const el = document.createElement('textarea');
    el.value = val;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand('copy');
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
};

const mPesa = {
  paybill: '400200',
  account: '169111',
  steps: [
    'Go to M-Pesa Menu on your phone',
    'Select "Lipa na M-Pesa"',
    'Select "Pay Bill"',
    'Enter Business No. 400200',
    `Enter Account No. 169111`,
    'Enter the amount you wish to give',
    'Enter your M-Pesa PIN and confirm',
  ],
};

const Donate = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (label: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(label);
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 2000);
    }
  };

  const CopyBtn = ({ label, value }: { label: string; value: string }) => {
    const isCopied = copied === label;
    return (
      <button
        type="button"
        onClick={() => handleCopy(label, value)}
        className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all"
        aria-label={`Copy ${label}`}
      >
        {isCopied ? (
          <>
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Copy</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-aurora opacity-60" aria-hidden />
        <div className="absolute inset-0 grain-overlay pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Shield className="w-3.5 h-3.5" /> Secure · Cheerful · Purpose-driven
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Give Online</h1>
          <blockquote className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed italic">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
            or under compulsion, for God loves a cheerful giver.&rdquo;
            <cite className="block not-italic text-amber-400 font-semibold mt-3 text-base">
              — 2 Corinthians 9:7
            </cite>
          </blockquote>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Donation Options */}
          <div className="space-y-6">
            {/* M-Pesa */}
            <TiltCard>
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100 h-full">
                <div className="flex items-center mb-5">
                  <div className="bg-emerald-100 p-2.5 rounded-xl mr-4">
                    <Smartphone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-grow pr-3">
                    <h3 className="text-xl font-bold text-gray-900">Give via M-Pesa</h3>
                    <p className="text-sm text-gray-500">Fast and secure mobile money transfer</p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ready
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 p-5 rounded-xl border border-emerald-100 space-y-4 mb-5">
                  <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                        Paybill Number
                      </p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                        {mPesa.paybill}
                      </p>
                    </div>
                    <CopyBtn label="paybill" value={mPesa.paybill} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                        Account Number
                      </p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                        {mPesa.account}
                      </p>
                    </div>
                    <CopyBtn label="account" value={mPesa.account} />
                  </div>
                </div>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-gray-700 hover:text-slate-900 select-none mb-3">
                    <span>Step-by-step guide</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <ol className="space-y-2.5 mt-2">
                    {mPesa.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
            </TiltCard>

            {/* PayPal */}
            <TiltCard>
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-5">
                  <div className="bg-blue-100 p-2.5 rounded-xl mr-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Give via PayPal</h3>
                    <p className="text-sm text-gray-500">International cards · Debit · Credit</p>
                  </div>
                </div>
                <a
                  href="https://www.paypal.me/kmcinewest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full inline-flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3.5 px-6 rounded-full transition-colors press-lift shadow-sm"
                >
                  <span className="text-lg italic">Pay</span>
                  <span className="text-lg italic font-black text-sky-300">Pal</span>
                  <span className="ml-1">Give securely</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  PayPal supports Visa, Mastercard, Amex and most international debit/credit cards.
                  You do not need a PayPal account.
                </p>
              </div>
            </TiltCard>

            {/* Bank Transfer */}
            <TiltCard>
              <div className="bg-white p-7 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-5">
                  <div className="bg-slate-100 p-2.5 rounded-xl mr-4">
                    <Building2 className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Bank Transfer</h3>
                    <p className="text-sm text-gray-500">Direct deposit · No fees</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs mt-1">
                      Bank
                    </span>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-bold text-gray-900">Equity Bank (Kenya)</span>
                      <CopyBtn label="bank" value="Equity Bank (Kenya)" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-gray-200 pt-3">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs mt-1">
                      Account Name
                    </span>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-bold text-gray-900">Kingdom Missions Centre Int&apos;l</span>
                      <CopyBtn label="accname" value="Kingdom Missions Centre Int'l" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-gray-200 pt-3">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs mt-1">
                      Account No.
                    </span>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-bold text-gray-900 font-mono">
                        <span className="text-amber-600 italic">Request by email</span>
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href="mailto:info@kmci.org?subject=Bank%20Details%20for%20Giving"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 font-bold py-3.5 px-6 rounded-full hover:bg-slate-900 hover:text-white transition-colors"
                >
                  Email us for bank details <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </TiltCard>
          </div>

          {/* Impact Section */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-amber-500 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

              <Heart className="w-16 h-16 mb-6 text-white fill-white/20" />
              <h2 className="text-3xl font-bold mb-6">Your Giving Makes a Difference</h2>
              <p className="text-lg mb-8 leading-relaxed opacity-90">
                Every contribution helps us to continue our mission of spreading the Gospel and serving
                our community. Here is how your giving helps:
              </p>

              <ul className="space-y-4">
                {[
                  'Supporting local and international missions',
                  'Feeding programs for the needy in Kinoo',
                  "Youth and Children's ministry resources",
                  'Church maintenance and development',
                  'Community outreach events',
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-white/20 p-1 rounded-full mr-3 mt-1">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-sm text-white/80 leading-relaxed">
                  <strong className="text-white">Thank you!</strong> Your generosity enables this church
                  to carry its vision and be a blessing to many. May the Lord return to you pressed
                  down, shaken together and running over — pressed down, shaken together and running
                  over (Luke 6:38).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
