function getOrigin() {
  return window.location.origin;
}

export function isBankApp() {
  return process.env.BANK_APP === getOrigin();
}

export function isAuthApp() {
  return process.env.AUTH_APP === getOrigin();
}

export function isContainerApp() {
  return process.env.CONTAINER_APP === getOrigin();
}
