import ContentTable from '@/components/ContentTable';
import getBucketConfig from '@/utils/getBucketConfig';
import S3Utils from '@/utils/s3Utils';
import {kv} from '@vercel/kv';
import {notFound} from 'next/navigation';

let s3Utils: S3Utils;

const setupS3Utils = async () => {
  const buckets = await getBucketConfig();
  if (!s3Utils) {
    s3Utils = new S3Utils(buckets);
  }
};

export async function generateStaticParams() {
  await setupS3Utils();
  return s3Utils.buckets.map(({id}) => ({bucket: id}));
}

export default async function Page({
  params,
}: Readonly<{params: {bucket: string}}>) {
  await setupS3Utils();
  const bucket = s3Utils.buckets.find(x => x.id === params.bucket);
  if (!bucket) {
    return notFound();
  }
  const objects = await Promise.all(
    bucket.prefixes.map(async x => {
      const {size, updatedAt} = await kv.json.get(`${bucket.id}/${x}`);
      return {
        class: 'STANDARD',
        key: x,
        lastModified: updatedAt,
        redirect: `/${bucket.id}/${x}`,
        size: size,
      };
    })
  );
  const {size, updatedAt} = await kv.json.get(bucket.id);
  const {size: rootSize, updatedAt: rootUpdatedAt} = await kv.json.get(
    's3-explorer-summary'
  );
  return (
    <ContentTable
      backDir={{
        class: 'STANDARD',
        key: '../',
        lastModified: rootUpdatedAt,
        redirect: '/',
        size: rootSize,
      }}
      contentSize={size}
      objects={objects}
      title={`You are currently browsing content in: /${bucket.id}`}
      updatedAt={updatedAt}
    />
  );
}

export const revalidate = 300;
