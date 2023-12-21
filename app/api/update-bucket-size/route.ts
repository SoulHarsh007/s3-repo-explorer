import getBucketConfig from '@/utils/getBucketConfig';
import S3Utils from '@/utils/s3Utils';
import updateCachedBucketSize from '@/utils/updateCachedBucketSize';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  if (request.headers.get('X-AUTH-KEY') !== process.env.AUTH_KEY) {
    return NextResponse.json(
      {
        msg: 'You are not authorized to access this endpoint',
      },
      {
        status: 401,
      }
    );
  }
  const buckets = await getBucketConfig();
  const s3Utils = new S3Utils(buckets);
  updateCachedBucketSize(s3Utils);
  return NextResponse.json(
    {
      msg: 'Successfully queued bucket size update',
    },
    {
      status: 200,
    }
  );
}
