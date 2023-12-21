import {kv} from '@vercel/kv';
import pb from 'pretty-bytes';

import S3Utils from './s3Utils';

export default async function updateCachedBucketSize(s3Utils: S3Utils) {
  let finalSize = 0;
  let lastUpdate: Date | undefined;
  await Promise.all(
    s3Utils.buckets.map(async bucket => {
      let totalSize = 0;
      let lastBucketUpdate: Date | undefined;
      await Promise.all(
        bucket.prefixes.map(async prefix => {
          const {size, updatedAt} = await s3Utils.estimateSizeAndUpdateTS(
            bucket.id,
            prefix
          );
          totalSize += size;
          if (updatedAt) {
            if (!lastUpdate || updatedAt > lastUpdate) {
              lastUpdate = updatedAt;
            }
            if (!lastBucketUpdate || updatedAt > lastBucketUpdate) {
              lastBucketUpdate = updatedAt;
            }
          }
          await kv.json.set(`${bucket.id}/${prefix}`, '$', {
            size: pb(size),
            updatedAt: updatedAt?.toJSON() ?? 'N/A',
          });
        })
      );
      finalSize += totalSize;
      await kv.json.set(bucket.id, '$', {
        size: pb(totalSize),
        updatedAt: lastBucketUpdate?.toJSON() ?? 'N/A',
      });
    })
  );
  await kv.json.set('s3-explorer-summary', '$', {
    size: pb(finalSize),
    updatedAt: lastUpdate?.toJSON() ?? 'N/A',
  });
  return finalSize;
}
