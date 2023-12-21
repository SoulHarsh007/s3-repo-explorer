import ContentTable from '@/components/ContentTable';
import getBucketConfig from '@/utils/getBucketConfig';
import S3Utils from '@/utils/s3Utils';
import {kv} from '@vercel/kv';

let s3Utils: S3Utils;

const setupS3Utils = async () => {
  const buckets = await getBucketConfig();
  if (!s3Utils) {
    s3Utils = new S3Utils(buckets);
  }
};

export default async function Page() {
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
  const objects = await Promise.all(
    s3Utils.buckets.map(async x => {
      const {size, updatedAt} = await kv.json.get(x.id);
      return {
        class: 'STANDARD',
        key: x.id,
        lastModified: updatedAt,
        redirect: `/${x.id}`,
        size: size,
      };
    })
  );
  const {size, updatedAt} = await kv.json.get('s3-explorer-summary');
  return (
    <div className="flex flex-col w-full justify-center p-4">
      <ContentTable
        contentSize={size}
        objects={objects}
        title="You are currently browsing content in: /"
        updatedAt={updatedAt}
      />
    </div>
  );
}

export const revalidate = 300;
