'use client';

import {BucketObject} from '@/utils/s3Utils';
import {
  ArchiveBoxIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';
import {
  Badge,
  Card,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
} from '@tremor/react';
import Link from 'next/link';
import {Suspense, useState} from 'react';

import Loader from './Loader';

function BackDir({backDir}: Readonly<{backDir?: BucketObject}>) {
  if (!backDir) {
    return null;
  }
  return (
    <TableRow key={backDir.key}>
      <TableCell>
        <Link className="underline decoration-dotted" href={backDir.redirect}>
          {backDir.key}
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          color={
            backDir.class.toLocaleLowerCase() === 'standard' ? 'green' : 'amber'
          }
        >
          {backDir.class}
        </Badge>
      </TableCell>
      <TableCell>{backDir.size}</TableCell>
      <TableCell className="text-right">
        {new Date(backDir.lastModified).toLocaleString()}
      </TableCell>
    </TableRow>
  );
}

function LoadingRows({isLoading}: Readonly<{isLoading?: boolean}>) {
  if (!isLoading) {
    return null;
  }
  return (
    <>
      <TableRow>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
        <TableCell>
          <div className="h-2 dark:bg-[#252525] bg-[#d1d5db] rounded"></div>
        </TableCell>
      </TableRow>
    </>
  );
}

function LoadingTable() {
  return (
    <TableBody>
      <LoadingRows isLoading />
    </TableBody>
  );
}

export default function ContentTable({
  backDir,
  contentSize = 'N/A',
  isLoading = false,
  objects,
  title,
  updatedAt = 'N/A',
}: Readonly<{
  backDir?: BucketObject;
  contentSize?: string;
  isLoading?: boolean;
  objects: BucketObject[];
  title: string;
  updatedAt?: string;
}>) {
  const [searchString, setSearchString] = useState('');
  const searchKeys = searchString
    .trim()
    .toLowerCase()
    .split(' ')
    .map(x => x.trim());
  const isObjectSelected = (object: BucketObject) => {
    if (searchString.trim().length === 0) {
      return true;
    }
    const objectKeys = object.key.toLowerCase().split('-');
    return (
      searchKeys.findIndex(
        searchKey => objectKeys.findIndex(x => x.includes(searchKey)) !== -1
      ) !== -1
    );
  };
  return (
    <Card className="flex-auto h-full">
      <Flex
        alignItems="center"
        className="space-y-2"
        flexDirection="col"
        justifyContent="center"
      >
        <Flex className="space-x-2" justifyContent="center">
          <div className="font-medium text-tremor-title text-center text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
            {isLoading ? (
              <div className="flex justify-center p-4 motion-safe:animate-pulse">
                <div className="mt-1">
                  <Loader />
                </div>
                <div className="mb-1">Loading content...</div>
              </div>
            ) : (
              title
            )}
          </div>
        </Flex>
        <Flex className="space-x-2" justifyContent="center">
          <Badge color="green" icon={QueueListIcon}>
            {objects.length}
          </Badge>
          <Badge color="green" icon={ArchiveBoxIcon}>
            {contentSize}
          </Badge>
          <Badge color="green" icon={ClockIcon}>
            {updatedAt !== 'N/A' ? new Date(updatedAt).toLocaleString() : 'N/A'}
          </Badge>
        </Flex>
        <TextInput
          className="max-w-2xl"
          disabled={isLoading}
          icon={MagnifyingGlassIcon}
          onValueChange={(value: string) => setSearchString(value)}
          placeholder="Search..."
          value={searchString}
        />
      </Flex>
      <Table className="mt-6 w-full">
        <TableHead>
          <TableRow>
            <TableHeaderCell>File</TableHeaderCell>
            <TableHeaderCell>Class</TableHeaderCell>
            <TableHeaderCell>Size</TableHeaderCell>
            <TableHeaderCell className="text-right">
              Upload Time (Your Local Time)
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <Suspense fallback={<LoadingTable />}>
          <TableBody>
            <BackDir backDir={backDir} />
            <LoadingRows isLoading={isLoading} />
            {objects
              .filter(item => isObjectSelected(item))
              .map(item => (
                <TableRow key={item.key}>
                  <TableCell>
                    <Link
                      className="underline decoration-dotted"
                      href={item.redirect}
                    >
                      {`${item.key}${item.lastModified ? '' : '/'}`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        item.class.toLocaleLowerCase() === 'standard'
                          ? 'green'
                          : 'amber'
                      }
                    >
                      {item.class}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="text-right">
                    {new Date(item.lastModified).toLocaleString() ?? 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Suspense>
      </Table>
    </Card>
  );
}
