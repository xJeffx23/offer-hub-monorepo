"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LoadingBar from "@/components/ui/LoadingBar";

import {
  Mail,
  Cookie,
  ShieldCheck,
  Link2,
  Trash2,
  Download,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Data Collection Policy",
    description:
      "We collect information you voluntarily provide when creating an account, setting up your marketplace, or contacting support — including your name, email address, business details, and payment information. We also automatically collect technical data such as IP addresses, browser type, device identifiers, and interaction logs to ensure the stability, security, and performance of Offer Hub.",
    large: false,
    iconColor: "#149A9B",
  },
  {
    icon: Cookie,
    title: "Cookies",
    description:
      "We use essential cookies to keep you logged in and maintain your session. With your consent, we may use analytics cookies to understand how users navigate the platform. These are never used for advertising. You can manage your preferences at any time via your browser settings or our cookie preference center.",
    large: false,
    iconColor: "#149A9B",
  },
  {
    icon: Link2,
    title: "Third-Party Services",
    description:
      "Offer Hub integrates with carefully selected third-party services. Payment processing is handled by PCI-compliant providers — we never store raw card data. Infrastructure providers may process your data under strict agreements aligned with GDPR. We do not sell your data to third parties, nor share it with advertisers.",
    large: false,
    iconColor: "#149A9B",
  },
];

type RequestStatus = { ok: boolean; message: string } | null;

function DataRightsForm({
  title,
  description,
  icon: Icon,
  endpoint,
  successMessage,
  buttonLabel,
  destructive,
}: {
  title: string;
  description: string;
  icon: React.FC<{ size?: number; className?: string }>;
  endpoint: string;
  successMessage?: string;
  buttonLabel: string;
  destructive?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<RequestStatus>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, message: json.error ?? "An error occurred." });
      } else {
        setStatus({ ok: true, message: successMessage ?? json.message ?? "Done." });
        setEmail("");
      }
    } catch {
      setStatus({ ok: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 rounded-[2.5rem] bg-bg-elevated shadow-neu-raised flex flex-col gap-6">
      <div className="w-14 h-14 rounded-2xl shadow-neu-sunken-subtle flex items-center justify-center shrink-0 bg-bg-elevated">
        <Icon size={24} className="text-theme-primary" />
      </div>
      <div>
        <h3 className="text-xl font-black tracking-tight mb-2 text-content-primary">{title}</h3>
        <p className="text-sm font-medium leading-relaxed text-content-secondary">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="rounded-xl px-4 py-3 text-sm bg-bg-sunken shadow-neu-sunken-subtle text-content-primary placeholder:text-content-secondary/60 outline-none focus:ring-2 focus:ring-theme-primary/30 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 ${
            destructive
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "bg-theme-primary text-white hover:bg-theme-primary-hover shadow-lg"
          }`}
        >
          {loading ? "Processing…" : buttonLabel}
        </button>
        {status && (
          <p className={`text-xs font-medium ${status.ok ? "text-theme-primary" : "text-red-500"}`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingBar />
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-24">

        {/* Heading */}
        <div className="text-center mb-20 md:mb-28 animate-fadeInUp">
          <p
            className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-theme-primary">
            Data Governance
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-content-primary leading-none mb-6"
          >
            Privacy & <span className="text-theme-primary">Transparency</span>
          </h1>
          <p
            className="mt-4 text-lg sm:text-xl font-medium max-w-2xl mx-auto px-2 text-content-secondary leading-relaxed"
          >
            We believe in full transparency about how we handle your data.
            Privacy is a feature, not an afterthought.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated shadow-neu-raised-sm text-xs font-bold text-content-secondary">
            Last updated: <span className="text-theme-primary">April 28, 2026</span>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`${feature.large ? "sm:col-span-2 md:col-span-2" : ""
                  } p-10 rounded-[2.5rem] bg-bg-elevated shadow-neu-raised flex flex-col gap-6 group hover:shadow-neu-raised-hover transition-all duration-500`}
              >
                <div
                  className="w-14 h-14 rounded-2xl shadow-neu-sunken-subtle flex items-center justify-center shrink-0 bg-bg-elevated group-hover:shadow-neu-sunken transition-all duration-300"
                >
                  <Icon size={24} className="text-theme-primary" />
                </div>
                <div>
                  <h3
                    className={`font-black tracking-tight mb-4 ${feature.large ? "text-2xl" : "text-xl"} text-content-primary`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`font-medium leading-relaxed ${feature.large ? "text-base" : "text-sm"} text-content-secondary`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Third-Party Data Processors */}
        <div className="mt-24 mb-24 animate-fadeInUp">
          <div className="flex flex-col gap-6 mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-content-primary">
              Third-Party <span className="text-theme-primary">Data Processors</span>
            </h2>
            <p className="text-lg font-medium text-content-secondary max-w-3xl leading-relaxed">
              To provide our services, we share limited data with the following third-party processors. Each processor is carefully vetted and processes data only for specific, disclosed purposes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Processors list */}
            {[
              {
                name: "Supabase",
                purpose: "Database storage and user authentication",
                data: "Email, hashed passwords, profile information, and application state metrics.",
                region: "Data stored in EU or US depending on project region.",
                link: "https://supabase.com/privacy",
              },
              {
                name: "ipapi.co",
                purpose: "IP-based geolocation and security monitoring",
                data: "User IP address (collected on every page view to determine region and prevent abuse).",
                link: "https://ipapi.co/privacy/",
              },
              {
                name: "GitHub",
                purpose: "Public API for fetching contributor and repository data",
                data: "GitHub usernames and public profile information associated with contributions.",
                link: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
              },
              {
                name: "Airtm",
                purpose: "Fiat-to-crypto payment processing and balance management",
                data: "User identifiers, transaction amounts, and currency preferences.",
                link: "https://www.airtm.com/en/privacy-policy/",
              },
              {
                name: "Trustless Work / Stellar",
                purpose: "Blockchain-based escrow and transaction settlement",
                data: "Public wallet addresses and transaction metadata (stored immutably on-chain).",
                link: "https://trustlesswork.com/privacy",
              },
            ].map((processor) => (
              <div key={processor.name} className="p-8 rounded-[2rem] bg-bg-elevated shadow-neu-raised flex flex-col gap-4 border border-theme-primary/5 hover:shadow-neu-raised-hover transition-all duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-content-primary">{processor.name}</h3>
                  <a
                    href={processor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    Privacy Policy <Link2 size={12} />
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-content-secondary block mb-1">Purpose</span>
                    <p className="text-sm font-medium text-content-secondary leading-relaxed">{processor.purpose}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-content-secondary block mb-1">Data Shared</span>
                    <p className="text-sm font-medium text-content-secondary leading-relaxed">{processor.data}</p>
                  </div>
                  {processor.region && (
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-content-secondary block mb-1">Information</span>
                      <p className="text-sm font-medium text-content-secondary leading-relaxed">{processor.region}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact card */}
        <div
          className="p-8 sm:p-12 md:p-14 rounded-[3rem] shadow-neu-raised flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-14 mt-16 bg-bg-elevated"
        >
          {/* Left: copy */}
          <div className="flex flex-col gap-6 md:max-w-md">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-neu-sunken-subtle bg-bg-elevated"
            >
              <Mail size={24} className="text-theme-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-content-primary tracking-tight mb-4">Get in Touch</h2>
              <p
                className="font-medium leading-relaxed text-base text-content-secondary"
              >
                Questions about this policy or how we handle your data? Our privacy
                team is here to help. We aim to respond to all inquiries within 2
                business days.
              </p>
            </div>
          </div>

          {/* Right: contacts */}
          <div className="flex flex-col gap-5 w-full md:w-auto md:shrink-0 md:min-w-[280px]">
            {[
              { label: "Privacy inquiries", email: "privacy@offerhub.io" },
              { label: "General support", email: "support@offerhub.io" },
            ].map(({ label, email }) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="flex flex-col gap-1 rounded-2xl px-6 py-5 transition-all duration-300 shadow-neu-sunken-subtle bg-bg-elevated hover:shadow-neu-sunken group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-content-secondary">
                  {label}
                </span>
                <span className="text-base font-bold text-theme-primary group-hover:text-content-primary transition-colors">
                  {email}
                </span>
              </a>
            ))}

            <div
              className="rounded-2xl px-6 py-5 shadow-neu-raised-sm bg-bg-elevated"
            >
              <p className="text-xs leading-relaxed font-medium text-content-secondary">
                Offer Hub Inc.
                <br />
                123 Market Street, Suite 400
                <br />
                San Francisco, CA 94105, USA
              </p>
            </div>
          </div>
        </div>
        {/* Data rights */}
        <div className="mt-16">
          <div className="text-center mb-10 animate-fadeInUp">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-3 text-theme-primary">
              GDPR / CCPA
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-content-primary">
              Your Data Rights
            </h2>
            <p className="mt-3 text-base font-medium max-w-xl mx-auto text-content-secondary leading-relaxed">
              Under GDPR Articles 17 and 20, you may request deletion or export of your personal data at any time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <DataRightsForm
              title="Export My Data"
              description="Receive a copy of all personal data we hold for your email address (GDPR Article 20 — data portability)."
              icon={Download}
              endpoint="/api/privacy/export"
              successMessage="Your data has been returned below. Save this response for your records."
              buttonLabel="Export my data"
            />
            <DataRightsForm
              title="Delete My Data"
              description="Permanently remove all personal data associated with your email address (GDPR Article 17 — right to erasure)."
              icon={Trash2}
              endpoint="/api/privacy/delete"
              buttonLabel="Delete my data"
              destructive
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
