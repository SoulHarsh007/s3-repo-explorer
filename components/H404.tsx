import {Card} from '@tremor/react';

export default function H404() {
  return (
    <Card className="motion-safe:animate-slow-pulse max-w-md h-64 flex flex-col justify-center">
      <div className="space-y-2 font-medium text-tremor-title text-center text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
        <p className="text-center text-7xl">404</p>
        <p className="text-center">It looks like you are lost!</p>
      </div>
    </Card>
  );
}
