import Link from 'next/link';

export function BannerCarousel() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-12 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-5">
            Lorem ipsum dolor sit amet
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-gray-800 transition-colors duration-300"
          >
            Lorem ipsum
          </Link>
        </div>
      </div>
    </section>
  );
}
