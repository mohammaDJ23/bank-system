export function isMicroFrontEnd(): boolean {
  return !!JSON.parse(process.env.IS_MICRO_FRONT_END || JSON.stringify(''));
}
