export const validators = {
  isEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isISBN(isbn: string) {
    // 移除所有非数字字符
    isbn = isbn.replace(/[^0-9X]/gi, "");

    // ISBN-10
    if (isbn.length === 10) {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += (10 - i) * parseInt(isbn[i]);
      }
      const last = isbn[9].toUpperCase();
      sum += last === "X" ? 10 : parseInt(last);
      return sum % 11 === 0;
    }

    // ISBN-13
    if (isbn.length === 13) {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i]);
      }
      const check = (10 - (sum % 10)) % 10;
      return check === parseInt(isbn[12]);
    }

    return false;
  },

  isPhone(phone: string) {
    return /^1[3-9]\d{9}$/.test(phone);
  },

  isStrongPassword(password: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
  },
};
