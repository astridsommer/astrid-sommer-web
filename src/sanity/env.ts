export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // No lanzamos error en build para no romper el sitio si aun no hay .env
    console.warn(errorMessage)
    return '' as unknown as T
  }
  return v
}
