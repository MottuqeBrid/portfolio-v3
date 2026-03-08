import Image from "next/image";
import Link from "next/link";

export default function Logo({
  href,
  classes,
  size,
  imgClass,
}: {
  href: string;
  classes?: string;
  size?: string;
  imgClass?: string;
}) {
  // dark:invert
  return (
    <Link href={href || "/"} className={classes}>
      <Image
        className={` ${size === "large" ? "w-40" : "w-24"} ${imgClass || ""}`}
        src="/logo_t.png"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
    </Link>
  );
}
