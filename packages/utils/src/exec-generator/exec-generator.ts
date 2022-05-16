export function* execGenerator(regex: RegExp, str: string) {
  let res;
  while (null != (res = regex.exec(str))) {
    yield res[0];
  }
}
