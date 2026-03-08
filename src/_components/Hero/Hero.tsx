import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <Image
          width={400}
          height={400}
          alt="mottuqe brid web developer"
          placeholder="blur"
          blurDataURL="/me.jpg"
          src={`/me.jpg`}
        />
      </div>
      <div className="w-1/2">
        <h1 className="text-3xl font-bold">Mottuqe Brid</h1>
        <p className="text-lg">Web Developer</p>
      </div>
    </div>
  );
}
