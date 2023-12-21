import ContentTable from '@/components/ContentTable';

export default async function Page() {
  return (
    <div className="flex flex-col w-full justify-center p-4 motion-safe:animate-pulse">
      <ContentTable isLoading objects={[]} title="" />
    </div>
  );
}

export const revalidate = 300;
