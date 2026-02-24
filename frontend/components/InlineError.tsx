type InlineErrorProps = {
  message: string;
};

export default function InlineError({ message }: InlineErrorProps) {
  return (
    <p className="text-sm text-red-600 mt-1" role="alert">
      {message}
    </p>
  );
}
