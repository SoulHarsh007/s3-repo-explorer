import {Card} from '@tremor/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <Card className="rounded-lg shadow p-3 w-full h-[72px]">
      <div className="text-sm text-center">
        <Link className="text-2xl font-mono flex items-center" href="/" replace>
          <Image
            alt="SoulHarsh007"
            className="inline-block dark:invert"
            height={48}
            priority
            quality={100}
            src="/logo.svg"
            width={48}
          />
          <div className="mt-1">SoulHarsh007</div>
        </Link>
      </div>
    </Card>
  );
}
