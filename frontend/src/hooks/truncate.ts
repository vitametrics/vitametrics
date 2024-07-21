export const truncateName = (name: string) => {
    return name.length > 25 ? `${name.substring(0, 22)}...` : name;
  };

  export const truncate = (str: string, n: number) => {
    return str.length > n ? str.substr(0, n - 1) : str;
  };
