import { FiCode, FiLayers, FiMapPin, FiTrendingUp } from "react-icons/fi";

const strengths = [
  {
    title: "Frontend systems",
    description:
      "Building polished interfaces with React, Next.js, Tailwind CSS, and a strong focus on accessibility.",
    Icon: FiLayers,
  },
  {
    title: "Full-stack delivery",
    description:
      "Connecting clean UI with practical backend services, APIs, and data flows that scale with the product.",
    Icon: FiCode,
  },
  {
    title: "Continuous growth",
    description:
      "Learning fast, refining process, and staying current with tools that genuinely improve product quality.",
    Icon: FiTrendingUp,
  },
];

const highlights = [
  "Responsive by default",
  "Clean architecture",
  "Performance-minded",
];

export default function About({ id }: { id: string }) {
  return (
    <section id={id} className="mt-12" aria-labelledby="about-heading">
      <div className="relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100/90 p-6 shadow-xl shadow-base-300/20 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(115,115,115,0.14),transparent_30%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-semibold uppercase tracking-[0.24em] text-primary">
                About me
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-2 text-base-content/70">
                <FiMapPin className="text-primary" />
                Khulna, Bangladesh
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h2
                id="about-heading"
                className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl lg:text-5xl"
              >
                Building useful products with clean code and deliberate design.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
                I&apos;m Md. Mottuqe Brid, a web developer who enjoys turning
                ideas into fast, responsive, and maintainable digital
                experiences. My work sits at the intersection of thoughtful UI,
                scalable frontend architecture, and practical product thinking.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-base-content/75">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-base-300 bg-base-200/80 px-4 py-2"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {strengths.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-base-300 bg-base-100/80 p-5 shadow-sm"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-base-content">
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-base-content/70">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-base-300 bg-base-200/70 p-6 shadow-sm sm:p-7">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              My story
            </p>
            <div className="space-y-4 text-sm leading-7 text-base-content/75 sm:text-base">
              <p>
                My journey into programming started with curiosity and quickly
                became a serious craft. Since then, I&apos;ve focused on
                building modern web applications that feel intuitive for users
                and remain manageable for teams.
              </p>
              <p>
                I care about more than shipping screens. I pay attention to
                structure, performance, and the small interface details that
                shape how a product feels in day-to-day use.
              </p>
              <p>
                Outside of delivery work, I spend time exploring new tools,
                sharpening fundamentals, and sharing what I learn with the wider
                developer community.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
