export default function LoadingProductPage() {
  return (
    <section className="py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[3/4] rounded-3xl bg-neutral-100 animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-neutral-100 animate-pulse" />
          <div className="h-10 w-2/3 rounded bg-neutral-100 animate-pulse" />
          <div className="h-8 w-32 rounded bg-neutral-100 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

