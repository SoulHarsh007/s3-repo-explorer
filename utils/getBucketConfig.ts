import {get} from '@vercel/edge-config';

import {BucketInfo} from './s3Utils';

let buckets: BucketInfo[] = [];

export default async function getBucketConfig() {
  if (!buckets.length) {
    const res = await get<BucketInfo[]>('s3-buckets');
    if (res) {
      buckets = {...res} as BucketInfo[];
    }
  }
  return buckets;
}
