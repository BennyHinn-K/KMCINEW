import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import ContactMap from '../components/ContactMap';
import { api } from '../lib/api';

const Contact = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onField = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): string | null => {
    if (!form.firstName.trim()) return 'Please enter your first name.';
    if (!form.lastName.trim()) return 'Please enter your last name.';
    if (!form.email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return 'Please enter a valid email address.';
    if (!form.message.trim() || form.message.trim().length < 10)
      return 'Please write a message of at least 10 characters.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      };
      await api.sendContact(payload);
      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      const msg =
        err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again later.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Connect With Us</h1>
          <p className="text-gray-300">We would love to pray with you and hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <TiltCard className="h-full">
            <div className="bg-slate-900 text-gray-100 p-6 rounded-xl shadow-2xl h-full flex flex-col items-center text-center">
              <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Call Us</h3>
              <a href="tel:+254720757185" className="text-gray-300 hover:text-amber-500 transition-colors">
                0720757185
              </a>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="bg-slate-900 text-gray-100 p-6 rounded-xl shadow-2xl h-full flex flex-col items-center text-center">
              <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Us</h3>
              <a
                href="mailto:info@kmci.org"
                className="text-gray-300 hover:text-amber-500 transition-colors break-all"
              >
                info@kmci.org
              </a>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="bg-slate-900 text-gray-100 p-6 rounded-xl shadow-2xl h-full flex flex-col items-center text-center">
              <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Visit Us</h3>
              <p className="text-gray-300">Kinoo, Gaitumbi</p>
            </div>
          </TiltCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactMap />

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>

            {status === 'success' && (
              <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold">Message sent successfully!</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                <div>
                  <p className="font-bold">Unable to send</p>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={form.firstName}
                    onChange={onField('firstName')}
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="John"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={form.lastName}
                    onChange={onField('lastName')}
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={onField('email')}
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={onField('message')}
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="How can we pray for you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
