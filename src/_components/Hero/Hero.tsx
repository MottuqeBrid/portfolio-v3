"use client";
import Image from "next/image";
import { motion as Motion } from "motion/react";
import { FaCode, FaReact } from "react-icons/fa";
import { LiaNodeJs } from "react-icons/lia";
import Typewriter from "typewriter-effect";
import { BiDownArrow } from "react-icons/bi";
import { BsGithub, BsLinkedin, BsWhatsapp } from "react-icons/bs";
import ResumeBtn from "../ResumeBtn/ResumeBtn";

const roleTitles = [
  "Next.js Developer",
  "Frontend Engineer",
  "MERN Stack Developer",
];

// const highlightItems = [
//   "React and Next.js applications",
//   "Accessible UI implementation",
//   "API-driven full-stack features",
// ];

const floatingBadges = [
  {
    Icon: FaCode,
    className:
      "absolute bottom-6 left-[18%] rounded-full z-20  bg-blue-600/85 p-4 text-white shadow-lg shadow-blue-900/20",
    animate: { y: [0, -10, 0], x: [0, 10, 0] },
    transition: { duration: 5, delay: 0.2 },
  },
  {
    Icon: FaReact,
    className:
      "absolute left-[12%] top-10 rounded-full z-20 bg-green-600/85 p-4 text-white shadow-lg shadow-green-900/20",
    animate: { y: [0, 12, 0], rotate: [0, 6, 0] },
    transition: { duration: 5.5, delay: 0.4 },
  },
  {
    Icon: LiaNodeJs,
    className:
      "absolute right-[10%] top-8 rounded-full z-20  bg-orange-500/90 p-4 text-white shadow-lg shadow-orange-900/20",
    animate: { y: [0, -12, 0], x: [0, -8, 0] },
    transition: { duration: 4.8, delay: 0.1 },
  },
];

export default function Hero({ id }: { id: string }) {
  return (
    <Motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex min-h-[80dvh] flex-col items-center justify-center gap-8 overflow-hidden rounded-lg bg-base-100 py-8 sm:flex-row"
    >
      <Motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="relative flex w-full items-center justify-center sm:w-1/2"
      >
        <Motion.div
          animate={{ scale: [1, 1.025, 1], rotate: [0, 0.8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-8 rounded-full bg-primary/15 blur-3xl"
        />

        <Motion.div
          animate={{ y: [0, -8, 0], scale: [1, 1.015, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-md p-4"
        >
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-dashed border-primary/30"
          />
          <Image
            className="relative z-10 w-full rounded-full border-2 border-base-300 object-cover shadow-2xl"
            width={400}
            height={400}
            alt="mottuqe brid web developer"
            placeholder="blur"
            blurDataURL="/me.jpg"
            src={`/me.jpg`}
          />
        </Motion.div>

        {floatingBadges.map(
          ({ Icon, className, animate, transition }, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.6, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 + index * 0.12 }}
              className={className}
            >
              <Motion.div
                animate={animate}
                transition={{
                  ...transition,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon size={24} />
              </Motion.div>
            </Motion.div>
          ),
        )}
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
        className="w-full space-y-3 px-4 sm:w-1/2"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Khulna, Bangladesh
        </p>
        <h1 className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
          Mottuqe Brid
        </h1>
        <Motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="min-h-8 text-lg font-medium text-base-content/80"
        >
          <Typewriter
            options={{
              strings: roleTitles,
              autoStart: true,
              loop: true,
            }}
          />
        </Motion.div>
        <p className="max-w-xl text-base leading-7 text-base-content/75">
          I build fast, scalable web applications with a strong focus on clean
          UI, responsive layouts, and maintainable frontend architecture. My
          main stack is React, Next.js, Node.js, Express, and MongoDB.
        </p>

        <div className="flex flex-wrap gap-2 text-sm text-base-content/70">
          {/* {highlightItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-base-300 bg-base-200 px-3 py-2"
            >
              {item}
            </span>
          ))} */}
          <a
            href="https://github.com/MottuqeBrid"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-base-300 bg-base-200 px-3 py-2 text-base-content transition-colors hover:bg-black hover:text-white"
          >
            <BsGithub size={24} />
          </a>
          <a
            href="https://linkedin.com/in/md-mottuqe-brid"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-base-300 hover:bg-blue-600 px-3 py-2 hover:text-white transition-colors text-blue-600 bg-white"
          >
            <BsLinkedin size={24} />
          </a>
          <a
            href="https://wa.me/8801308133343"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-base-300 hover:bg-green-500 px-3 py-2 hover:text-white transition-colors text-green-500 bg-white"
          >
            <BsWhatsapp size={24} />
          </a>
        </div>

        <div className="flex gap-2">
          <ResumeBtn className="btn btn-primary">Download Resume</ResumeBtn>
          <button className="btn btn-outline flex items-center justify-center gap-2">
            View My Work <BiDownArrow />
          </button>
        </div>
      </Motion.div>
    </Motion.section>
  );
}
