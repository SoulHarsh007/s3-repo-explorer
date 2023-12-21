import {Card, Title} from '@tremor/react';

export default function H404() {
  return (
    <Card className="motion-safe:animate-slow-pulse max-w-md h-64 flex flex-col justify-center">
      <div className="space-y-2">
        <Title className="text-center text-4xl">404</Title>
        <Title className="text-center">It looks like you are lost!</Title>
      </div>
    </Card>
  );
}
