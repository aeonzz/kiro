/**
 * All Electric shapes are fetched through our own gate-keeper proxy
 * (`routes/api/electric/shape.ts`) so the source id/secret stay server-side and
 * every shape is scoped to a team the user belongs to. The ShapeStream needs an
 * absolute URL, so we build it from the API origin.
 */
export const SHAPE_URL = `${import.meta.env.VITE_API_URL}/api/electric/shape`;
