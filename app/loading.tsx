/** Route level loading state — a calm shimmer while a page streams in. */
export default function Loading() {
  return (
    <div className="container-x py-24">
      <div className="skeleton mx-auto h-10 w-64 rounded-full" />
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
