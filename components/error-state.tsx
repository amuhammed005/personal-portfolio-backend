export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-red-500 font-medium mb-2">⚠ {message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 text-sm rounded bg-primary text-white hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// if (error) {
//   return (
//     <section id="about" className="py-24 md:py-32">
//       <div className="container mx-auto px-6">
//         <div className="max-w-5xl mx-auto">
//           <p className="text-red-500 text-center">Failed to load personal info. Please try again.</p>
//           <div className="flex justify-center mt-4">
//             <Button onClick={refetch}>Retry</Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// if (!personalInfo) {
//   return (
//     <section id="about" className="py-24 md:py-32">
//       <div className="container mx-auto px-6">
//         <div className="max-w-5xl mx-auto">
//           <p className="text-center text-muted-foreground">
//             No personal information found.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }