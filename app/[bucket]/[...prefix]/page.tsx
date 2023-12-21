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
  const routes: {bucket: string; prefix: string[]}[] = [];
  await setupS3Utils();
  s3Utils.buckets.forEach(bucket => {
    bucket.prefixes.forEach(prefix => {
      routes.push({bucket: bucket.id, prefix: prefix.split('/')});
    });
  });
  return routes;
}

export default async function Page({
  params,
}: Readonly<{
  params: {bucket: string; prefix: string[]};
}>) {
  const actualPrefix = params.prefix.join('/');
  await setupS3Utils();
  fetch(`${process.env.API_BASE_URL}/api/update-bucket-size`, {
    headers: {
      'X-AUTH-KEY': `${process.env.AUTH_KEY}`,
    },
    method: 'POST',
    next: {
      revalidate,
    },
  });
  const bucket = s3Utils.buckets.find(x => x.id === params.bucket);
  if (!bucket) {
    return notFound();
  }
  if (!bucket.prefixes.includes(actualPrefix)) {
    return (
      <div className="flex w-full justify-center p-4">Prefix not found</div>
    );
  }
  const objects = await s3Utils.listObjects(bucket.id, actualPrefix);
  const {size: bucketSize, updatedAt: bucketUpdatedAt} = await kv.json.get(
    bucket.id
  );
  const {size, updatedAt} = await kv.json.get(`${bucket.id}/${actualPrefix}`);
  return (
    <div className="flex flex-col w-full justify-center p-4">
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
    </div>
  );
}

export const revalidate = 300;
