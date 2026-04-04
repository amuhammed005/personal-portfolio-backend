// Custom hook for fetching data from an API endpoint
// Handles loading states, error handling, and provides a refetch function

import { useEffect, useState } from "react";

/**
 * Generic data fetching hook
 * @param url - API endpoint to fetch data from
 * @returns Object containing data, loading state, error message, and refetch function
 */
export function useFetch<T>(url: string) {
  // State to store the fetched data
  const [data, setData] = useState<T | null>(null);

  // Loading state - true while fetch is in progress
  const [loading, setLoading] = useState(true);

  // Error state - stores error message if fetch fails
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches data from the provided URL
   * Can be called manually via the returned refetch function
   */
  async function fetchData() {
    try {
      // Set loading state and clear any previous errors
      setLoading(true);
      setError(null);

      // ✅ Added: Log the fetch attempt for debugging
      console.log(`[useFetch] Fetching from: ${url}`);

      // Make the fetch request
      const res = await fetch(url);

      // ✅ Added: Log response status for debugging
      console.log(`[useFetch] Response status: ${res.status}`);

      // Check if response was successful
      if (!res.ok) {
        // ✅ Improved: Try to get error message from response body
        let errorMessage = `Error ${res.status}: Failed to fetch`;
        try {
          const errorData = await res.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If parsing error response fails, use default message
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response
      const result = await res.json();

      // ✅ Added: Log successful data fetch for debugging
      console.log(`[useFetch] Data fetched successfully:`, result);

      // ✅ Added: Validate that result is not undefined/null
      if (result === undefined || result === null) {
        throw new Error("API returned null or undefined data");
      }

      // Update data state with fetched result
      setData(result);
    } catch (err: any) {
      // Handle any errors during fetch or parsing
      const errorMessage = err.message || "Something went wrong";

      // ✅ Added: Log error for debugging
      console.error(`[useFetch] Error fetching from ${url}:`, err);

      setError(errorMessage);
      // ✅ Added: Set data to null on error to prevent stale data
      setData(null);
    } finally {
      // Always set loading to false when fetch completes (success or error)
      setLoading(false);
    }
  }

  // Effect runs when URL changes - automatically fetches data
  useEffect(() => {
    // ✅ Added: Only fetch if URL is provided
    if (!url) {
      console.warn("[useFetch] No URL provided, skipping fetch");
      setLoading(false);
      return;
    }

    fetchData();
    // Note: We intentionally only depend on 'url' to refetch when it changes
    // fetchData is stable and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Return data, loading state, error, and refetch function
  return { data, loading, error, refetch: fetchData };
}