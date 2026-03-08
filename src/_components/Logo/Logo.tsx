import Image from "next/image";
import Link from "next/link";

export default function Logo({
  href,
  classes,
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
        className={` ${imgClass || ""}`}
        src="/logo_t.png"
        alt="logo"
        width={100}
        height={20}
        priority
      />
    </Link>
  );
}
