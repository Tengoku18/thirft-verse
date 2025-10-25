interface UserNotFoundProps {
  instagramHandle: string | null;
}

const UserNotFound = (props: UserNotFoundProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-muted"
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
        <h1 className="font-heading mb-3 text-3xl font-bold text-primary">
          User Not Found
        </h1>
        <p className="mb-2 text-lg text-primary/60">
          The profile &quot;{props?.instagramHandle}&quot; does not exist.
        </p>
        <p className="text-muted">
          Please check the store URL and try again.
        </p>
      </div>
    </div>
  );
};

export default UserNotFound;
