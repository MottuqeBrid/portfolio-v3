import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image
        className="dark:invert"
        src="/logo.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
    </div>
  );
}
