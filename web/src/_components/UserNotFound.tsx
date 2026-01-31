import { getFullUrl } from '@/utils/env';
import LinkButton from './common/LinkButton';

interface UserNotFoundProps {
  instagramHandle: string | null;
}

const UserNotFound = (props: UserNotFoundProps) => {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <svg
            className="text-muted mx-auto h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="font-heading text-primary mb-3 text-3xl font-bold">
          User Not Found
        </h1>
        <p className="text-primary/60 mb-2 text-lg">
          The profile &quot;{props?.instagramHandle}&quot; does not exist.
        </p>
        <p className="text-muted mb-8">
          Please check the store URL and try again.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <LinkButton href={getFullUrl('/')} variant="primary">
            Go to Home
          </LinkButton>
          <LinkButton href={getFullUrl('/explore')} variant="outline">
            Explore Products
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default UserNotFound;
