import getBucketConfig from '@/utils/getBucketConfig';
import S3Utils from '@/utils/s3Utils';
import {MetadataRoute} from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = 'https://repo.soulharsh007.dev';
  const buckets = await getBucketConfig();
  const s3Utils = new S3Utils(buckets);
  const routes: MetadataRoute.Sitemap = [
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 1,
      url: baseURL,
    },
  ];
  s3Utils.buckets.forEach(bucket => {
    routes.push({
      changeFrequency: 'hourly',
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseURL}/${bucket.id}`,
    });
    bucket.prefixes.forEach(prefix => {
      routes.push({
        changeFrequency: 'hourly',
        lastModified: new Date(),
        priority: 0.9,
        url: `${baseURL}/${bucket.id}/${prefix}`,
      });
    });
  });
  return routes;
}
