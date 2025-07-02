export function extractUrlParams(
  requiredParamsList: string[],
  keyMappings: Record<string, string>
): Record<string, string> {
  const queryParams = new URLSearchParams(window.location.search);
  const requiredParamsSet = new Set(requiredParamsList);
  const paramsObject: Record<string, string> = {};

  queryParams.forEach((value, key) => {
    const lowerCaseKey = key.toLowerCase();
    if (requiredParamsSet.has(lowerCaseKey)) {
      const paramMappedKey = keyMappings[lowerCaseKey] ?? lowerCaseKey;
      paramsObject[paramMappedKey] = value;
    }
  });

  return paramsObject;
}
