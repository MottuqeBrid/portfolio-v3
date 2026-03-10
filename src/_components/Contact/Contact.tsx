"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { BsGithub, BsLinkedin, BsWhatsapp } from "react-icons/bs";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import Swal from "sweetalert2";

const contactChannels = [
  {
    title: "WhatsApp",
    description:
      "Best for quick discussion about websites, web apps, and frontend updates.",
    href: "https://wa.me/8801308133343",
    cta: "Start chat",
    Icon: BsWhatsapp,
    iconClassName: "text-green-500",
  },
  {
    title: "LinkedIn",
    description:
      "Reach out for freelance web development, remote roles, or collaboration.",
    href: "https://linkedin.com/in/md-mottuqe-brid",
    cta: "Send message",
    Icon: BsLinkedin,
    iconClassName: "text-sky-600",
  },
  {
    title: "GitHub",
    description:
      "Review recent web projects, frontend structure, and coding style.",
    href: "https://github.com/MottuqeBrid",
    cta: "View profile",
    Icon: BsGithub,
    iconClassName: "text-base-content",
  },
];

const initialFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact({ id }: { id: string }) {
  const [formValues, setFormValues] = useState(initialFormValues);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const patlod = {
      name: formValues.name,
      email: formValues.email,
      subject: formValues.subject,
      message: formValues.message,
    };
    const res = await fetch("/api/emails", {
      method: "POST",
      body: JSON.stringify(patlod),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setFormValues(initialFormValues);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Email sent successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send email. Please try again later.",
      });
    }
  }

  return (
    <section id={id} className="mt-12 mb-12" aria-labelledby="contact-heading">
      <div className="relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100/90 p-6 shadow-xl shadow-base-300/20 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(33,29,29,0.1),transparent_30%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-semibold uppercase tracking-[0.24em] text-primary">
                Contact
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-2 text-base-content/70">
                <FiMapPin className="text-primary" />
                Khulna, Bangladesh
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="rounded-3xl border border-base-300 bg-base-200/70 p-5 shadow-sm">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Best for
                </p>
                <div className="space-y-3 text-sm leading-7 text-base-content/75">
                  <p>
                    New website builds that need responsive layouts, clear UI,
                    and a modern frontend stack.
                  </p>
                  <p>
                    Existing web apps that need a cleaner interface, better
                    component structure, or a stronger React and Next.js setup.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[1.75rem] border border-base-300 bg-base-100/85 p-6 shadow-sm sm:p-7"
            >
              <div className="mb-6 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  Email Me
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75 sm:col-span-2">
                  <span className="font-medium text-base-content">Subject</span>
                  <input
                    type="text"
                    name="subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject of your message"
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75 sm:col-span-2">
                  <span className="font-medium text-base-content">
                    Messages
                  </span>
                  <textarea
                    name="message"
                    value={formValues.message}
                    onChange={handleChange}
                    placeholder="Your message or project details"
                    rows={6}
                    required
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Send Email
                  <FiArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-primary/15 bg-linear-to-br from-primary/14 via-base-100 to-base-200/80 p-6 shadow-sm sm:p-7">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Preferred contact
              </p>
              <h3 className="text-2xl font-semibold text-base-content sm:text-3xl">
                Available for web development work and collaboration.
              </h3>
              <p className="mt-4 text-sm leading-7 text-base-content/75 sm:text-base">
                Use WhatsApp for direct project discussion, or LinkedIn if you
                prefer a professional introduction. GitHub is there if you want
                to review my web development work before reaching out.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/8801308133343"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5"
                >
                  Message on WhatsApp
                  <FiArrowUpRight size={16} />
                </a>
                <a
                  href="https://linkedin.com/in/md-mottuqe-brid"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-5 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-base-200"
                >
                  Connect on LinkedIn
                  <FiArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              {contactChannels.map(
                ({ title, description, href, cta, Icon, iconClassName }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start justify-between gap-4 rounded-3xl border border-base-300 bg-base-100/85 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-base-100"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`inline-flex rounded-2xl bg-base-200 p-3 ${iconClassName}`}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-base-content">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-base-content/70">
                          {description}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-base-content/70 transition-transform group-hover:translate-x-0.5 group-hover:text-primary">
                      {cta}
                      <FiArrowUpRight size={16} />
                    </span>
                  </a>
                ),
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
