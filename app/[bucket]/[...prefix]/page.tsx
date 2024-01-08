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

export async function generateStaticParams({
  params: {bucket},
}: {
  params: {bucket: string};
}) {
  await setupS3Utils();
  const bucketObj = s3Utils.buckets.find(x => x.id === bucket);
  if (!bucketObj) {
    return [];
  }
  return bucketObj.prefixes.map(prefix => ({
    prefix: prefix.split('/'),
  }));
}

export default async function Page({
  params,
}: Readonly<{
  params: {bucket: string; prefix: string[]};
}>) {
  const actualPrefix = params.prefix.join('/');
  await setupS3Utils();
  const bucket = s3Utils.buckets.find(x => x.id === params.bucket);
  if (!bucket) {
    return notFound();
  }
  if (!bucket.prefixes.includes(actualPrefix)) {
    return notFound();
  }
  const objects = await s3Utils.listObjects(bucket.id, actualPrefix);
  const {size: bucketSize, updatedAt: bucketUpdatedAt} = await kv.json.get(
    bucket.id
  );
  const {size, updatedAt} = await kv.json.get(`${bucket.id}/${actualPrefix}`);
  return (
    <ContentTable
      backDir={{
        class: 'STANDARD',
        key: '../',
        lastModified: bucketUpdatedAt,
        redirect: `/${bucket.id}`,
        size: bucketSize,
      }}
      contentSize={size}
      objects={objects}
      title={`You are currently browsing content in: /${bucket.id}/${actualPrefix}`}
      updatedAt={updatedAt}
    />
  );
}

export const revalidate = 300;
