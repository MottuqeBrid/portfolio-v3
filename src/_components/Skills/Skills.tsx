import type { IconType } from "react-icons";
import { BsTools } from "react-icons/bs";
import { DiPython } from "react-icons/di";
import { FiCode, FiDatabase, FiLayers, FiTool } from "react-icons/fi";
import {
  SiExpress,
  SiFirebase,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNumpy,
  SiNodedotjs,
  SiPandas,
  SiPostman,
  SiReact,
  SiR,
  SiScikitlearn,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { PiChartScatterBold } from "react-icons/pi";
import { TbChartHistogram } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

type SkillItem = {
  name: string;
  icon: IconType;
  tint: string;
};

type SkillGroup = {
  title: string;
  description: string;
  Icon: IconType;
  skills: SkillItem[];
};

const skillGroups: SkillGroup[] = [
  {
    title: "Frontend development",
    description:
      "Crafting responsive interfaces with modern frameworks, strong component structure, and maintainable styling.",
    Icon: FiLayers,
    skills: [
      { name: "React", icon: SiReact, tint: "#61dafb" },
      { name: "Next.js", icon: SiNextdotjs, tint: "#111111" },
      { name: "TypeScript", icon: SiTypescript, tint: "#3178c6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, tint: "#06b6d4" },
      { name: "JavaScript", icon: SiJavascript, tint: "#f7df1e" },
    ],
  },
  {
    title: "Backend and APIs",
    description:
      "Building practical server-side features, integrating APIs, and delivering reliable application flows end to end.",
    Icon: FiCode,
    skills: [
      { name: "Node.js", icon: SiNodedotjs, tint: "#539e43" },
      { name: "Express.js", icon: SiExpress, tint: "#444444" },
      { name: "Firebase", icon: SiFirebase, tint: "#ffca28" },
      { name: "Postman", icon: SiPostman, tint: "#ff6c37" },
    ],
  },
  {
    title: "Data and storage",
    description:
      "Working with flexible data models and service-backed persistence for full-stack application development.",
    Icon: FiDatabase,
    skills: [
      { name: "MongoDB", icon: SiMongodb, tint: "#00ed64" },
      //   { name: "Firebase DB", icon: SiFirebase, tint: "#ffca28" },
    ],
  },
  {
    title: "Workflow and tooling",
    description:
      "Using collaborative and design-oriented tools to ship features cleanly and iterate with less friction.",
    Icon: FiTool,
    skills: [
      { name: "Git", icon: SiGit, tint: "#f05032" },
      { name: "GitHub", icon: SiGithub, tint: "#181717" },
      { name: "VS Code", icon: VscVscode, tint: "#007acc" },
    ],
  },
  {
    title: "Others  programming languages and tools",
    description:
      "I have experience with other programming languages and tools that complement my main stack and help me deliver better products.",
    Icon: BsTools,

    skills: [
      { name: "Python", icon: DiPython, tint: "#3776ab" },
      { name: "R", icon: SiR, tint: "#276dc3" },
      { name: "STATA", icon: TbChartHistogram, tint: "#1a5a96" },
      { name: "SPSS", icon: PiChartScatterBold, tint: "#1261a0" },
      { name: "Pandas", icon: SiPandas, tint: "#150458" },
      { name: "NumPy", icon: SiNumpy, tint: "#4dabcf" },
      { name: "Scikit-Learn", icon: SiScikitlearn, tint: "#f7931e" },
    ],
  },
];

const focusAreas = [
  "Component-driven UI",
  "Responsive layouts",
  "REST API integration",
  "Performance-aware builds",
];

export default function Skills({ id }: { id: string }) {
  return (
    <section id={id} className="mt-12" aria-labelledby="skills-heading">
      <div className="relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100/90 p-6 shadow-xl shadow-base-300/20 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(98,176,198,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(115,115,115,0.14),transparent_28%)]" />

        <div className="relative space-y-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Skills
            </span>
            <h2
              id="skills-heading"
              className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl lg:text-5xl"
            >
              A practical stack for building modern web products.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
              My toolkit is centered on JavaScript and TypeScript ecosystems,
              with a strong focus on React-based frontend work, API-driven
              backend delivery, and tools that keep projects maintainable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-base-content/75">
            {focusAreas.map((item) => (
              <span
                key={item}
                className="rounded-full border border-base-300 bg-base-200/80 px-4 py-2"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {skillGroups.map(({ title, description, Icon, skills }) => (
              <article
                key={title}
                className="rounded-3xl border border-base-300 bg-base-100/80 p-6 shadow-sm"
              >
                <div className="mb-5 flex items-start gap-4">
                  <div className="inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-base-content">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-base-content/70">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {skills.map(({ name, icon: SkillIcon, tint }) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-base-300 bg-base-200/70 p-4"
                    >
                      <div
                        className="mb-3 inline-flex rounded-xl p-3"
                        style={{
                          backgroundColor: `${tint}20`,
                          color: tint,
                        }}
                      >
                        <SkillIcon size={22} />
                      </div>
                      <p className="text-sm font-medium text-base-content">
                        {name}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
