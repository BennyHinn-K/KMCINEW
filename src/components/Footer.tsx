import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Youtube } from 'lucide-react';
import { cn } from '../lib/utils';
import { brandLogo } from '../branding';

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61593718366159', label: 'Facebook' },
  { icon: Youtube, href: 'https://www.youtube.com/@kmcinewest', label: 'YouTube' },
  { icon: Instagram, href: 'https://www.instagram.com/kmcinewest/', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/kmcinewest', label: 'Twitter' },
];

const quickLinks = [
  { name: 'Home', to: '/' },
  { name: 'About Us', to: '/about' },
  { name: 'Ministries', to: '/ministries' },
  { name: 'News & Events', to: '/announcements' },
  { name: 'Contact', to: '/contact' },
];

const ministryItems = [
  'Global Missions',
  'Youth & Children',
  "Women's Ministry",
  'School of Ministry',
  'Community Outreach',
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold mb-md text-primary">
    <span className="relative inline-block pb-xs">
      {children}
      <span className="absolute left-0 -bottom-0.5 h-[3px] w-12 rounded-pill bg-gradient-to-r from-accent via-accent to-transparent" />
    </span>
  </h3>
);

const FooterLink = ({
  to,
  children,
  external,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  external?: boolean;
}) => {
  const className = cn(
    'group inline-flex items-center text-ink-muted hover:text-primary transition-colors duration-normal ease-standard',
    'relative after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-gradient-to-r after:from-accent after:to-accent/50',
    'after:transition-all after:duration-normal after:ease-emphasis hover:after:w-full',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm px-0.5 -mx-0.5'
  );
  if (external || !to) {
    return (
      <a href={to || '#'} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden bg-[hsl(222_47%_7%)] text-primary section-pad border-t border-border/60"
      data-theme="midnight"
    >
      <div className="absolute inset-0 bg-mesh-aurora opacity-60 pointer-events-none" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-sm sm:px-md lg:px-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2xl mb-3xl">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-lg">
              <div className="bg-surface/10 backdrop-blur-sm text-primary p-xs rounded-lg border border-border/50 shadow-2">
                <img
                  src={brandLogo}
                  alt="KMCI logo"
                  className="w-10 h-10 rounded-md object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Kingdom Missions</span>
            </div>
            <p className="text-ink-muted mb-lg leading-relaxed text-sm max-w-sm">
              Advancing the Kingdom of God globally through evangelism, discipleship, and humanitarian outreach.
            </p>
            <div className="flex flex-wrap gap-xs">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    'w-10 h-10 inline-flex items-center justify-center rounded-pill',
                    'bg-surface/10 backdrop-blur-sm border border-border/50 text-ink-muted',
                    'press-lift hover:text-accent hover:border-accent/40 hover:bg-accent/10',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_7%)]'
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Quick Links</SectionHeading>
            <ul className="space-y-xs">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <FooterLink to={link.to}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading>Ministries</SectionHeading>
            <ul className="space-y-xs">
              {ministryItems.map((item) => (
                <li key={item} className="text-ink-muted text-sm">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading>Contact Us</SectionHeading>
            <ul className="space-y-md">
              <li className="flex items-start space-x-xs text-ink-muted text-sm">
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 inline-flex items-center justify-center border border-accent/25">
                  <MapPin className="w-4.5 h-4.5 text-accent" />
                </div>
                <span className="leading-relaxed">KMCI Center,<br />Kinoo, Gaitumbi</span>
              </li>
              <li className="flex items-center space-x-xs text-ink-muted text-sm">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 inline-flex items-center justify-center border border-accent/25">
                  <Phone className="w-4.5 h-4.5 text-accent" />
                </div>
                <a href="tel:0720757185" className="hover:text-primary transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">0720757185</a>
              </li>
              <li className="flex items-center space-x-xs text-ink-muted text-sm">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 inline-flex items-center justify-center border border-accent/25">
                  <Mail className="w-4.5 h-4.5 text-accent" />
                </div>
                <a href="mailto:info@kmci.org" className="hover:text-primary transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">info@kmci.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gradient mb-lg" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-primary/90 leading-tight mb-2xs">
              Kingdom Missions Center International
            </p>
            <p className="text-ink-subtle text-sm">
              &copy; {new Date().getFullYear()} — All rights reserved. Crafted with purpose.
            </p>
          </div>
          <div className="flex flex-wrap gap-md text-sm text-ink-muted">
            <FooterLink to="/privacy" external>Privacy Policy</FooterLink>
            <span className="text-border/60" aria-hidden>·</span>
            <FooterLink to="/terms" external>Terms of Service</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
