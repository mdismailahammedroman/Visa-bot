const pick = (obj: Record<string, unknown>, keys: string[]) => {
  const finalObj: Record<string, unknown> = {};
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;
