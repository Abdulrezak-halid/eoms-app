export namespace UtilToken {
  export function create(size: number): string {
    let token = "";

    for (let i = 0; i < size; i++) {
      const r = Math.floor(Math.random() * 62);
      const charCode = r < 10 ? r + 48 : r < 36 ? r + 55 : r + 61;

      token += String.fromCharCode(charCode);
    }

    return token;
  }
}
