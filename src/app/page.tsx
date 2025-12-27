import UrlShortenerForm from "@/components/UrlShortenerForm";

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-white text-black px-4">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Shorten URLs Instantly
          </h2>

          <p className="text-gray-600 mb-8">
            Shorten your long URLs instantly. Track clicks and manage links by
            creating a free account.
          </p>

          <UrlShortenerForm />
        </div>
      </main>
    </div>
  );
}
