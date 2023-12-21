import {_Object, ListObjectsV2Command, S3Client} from '@aws-sdk/client-s3';
import pb from 'pretty-bytes';

export type BucketInfo = {
  accessKeyId: string;
  bucket: string;
  endpoint: string;
  id: string;
  prefixes: string[];
  public: string;
  region: string;
  secretAccessKey: string;
};

export type PublicBucketInfo = {
  endpoint: string;
  id: string;
  prefixes: string[];
  public: string;
  region: string;
};

export type BucketObject = {
  class: string;
  key: string;
  lastModified: string;
  redirect: string;
  size: string;
};

export default class S3Utils {
  private _buckets: (BucketInfo & {s3: S3Client})[];
  public buckets: PublicBucketInfo[];

  constructor(buckets: BucketInfo[]) {
    this._buckets = buckets.map(x => ({
      ...x,
      s3: new S3Client({
        credentials: {
          accessKeyId: x.accessKeyId,
          secretAccessKey: x.secretAccessKey,
        },
        endpoint: x.endpoint,
        forcePathStyle: true,
        region: x.region,
      }),
    }));
    this.buckets = this._buckets.map(x => ({
      endpoint: x.endpoint,
      id: x.id,
      prefixes: x.prefixes,
      public: x.public,
      region: x.region,
    }));
  }

  async estimateSizeAndUpdateTS(
    bucketId: string,
    prefix = ''
  ): Promise<{size: number; updatedAt: Date | undefined}> {
    const bucket = this._buckets.find(x => x.id === bucketId);
    if (!bucket) {
      throw new Error(`Bucket ${bucketId} not found`);
    }
    let IsTruncated = true;
    let ContinuationToken: string | undefined;
    let out = 0;
    let latestTimestamp: Date | undefined;
    while (IsTruncated) {
      const response = await bucket.s3.send(
        new ListObjectsV2Command({
          Bucket: bucket.bucket,
          ContinuationToken,
          Delimiter: '/',
          Prefix: prefix.endsWith('/') ? prefix : `${prefix}/`,
        })
      );
      IsTruncated = response.IsTruncated ?? false;
      ContinuationToken = response.NextContinuationToken;
      out +=
        response.Contents?.reduce((acc, x) => {
          if (
            x.LastModified &&
            (!latestTimestamp || x.LastModified > latestTimestamp)
          ) {
            latestTimestamp = x.LastModified;
          }
          return acc + (x.Size ?? 0);
        }, 0) ?? 0;
    }
    return {
      size: out,
      updatedAt: latestTimestamp,
    };
  }

  async listObjects(bucketId: string, prefix: string): Promise<BucketObject[]> {
    const bucket = this._buckets.find(x => x.id === bucketId);
    if (!bucket) {
      throw new Error(`Bucket ${bucketId} not found`);
    }
    let IsTruncated = true;
    let ContinuationToken: string | undefined;
    let out: _Object[] = [];
    while (IsTruncated) {
      const response = await bucket.s3.send(
        new ListObjectsV2Command({
          Bucket: bucket.bucket,
          ContinuationToken,
          Delimiter: '/',
          Prefix: prefix.endsWith('/') ? prefix : `${prefix}/`,
        })
      );
      IsTruncated = response.IsTruncated ?? false;
      ContinuationToken = response.NextContinuationToken;
      out = out.concat(response.Contents ?? []);
    }
    return (
      out?.map(x => ({
        class: x.StorageClass ?? 'UNKNOWN',
        key: x.Key?.replace(`${prefix}/`, '').replace(prefix, '') ?? '',
        lastModified: x.LastModified?.toJSON() ?? '',
        redirect: `${bucket.public}/${x.Key}`,
        size: pb(x.Size ?? 0),
      })) || []
    );
  }
}
