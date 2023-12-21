import ContentTable from '@/components/ContentTable';

export default async function Page() {
  return (
    <div className="flex-auto h-full min-h-full motion-safe:animate-pulse">
      <ContentTable isLoading objects={[]} title="" />
    </div>
  );
}

export const revalidate = 300;
