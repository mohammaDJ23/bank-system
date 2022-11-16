export function isMicroFrontEnd() {
  return !!JSON.parse(process.env.IS_MICRO_FRONT_END || null);
}
