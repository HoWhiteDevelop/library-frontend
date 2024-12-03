export const dateUtils = {
  format(date: Date | string | number, fmt = "YYYY-MM-DD HH:mm:ss") {
    const d = new Date(date);
    const opt: Record<string, string> = {
      "Y+": d.getFullYear().toString(),
      "M+": (d.getMonth() + 1).toString(),
      "D+": d.getDate().toString(),
      "H+": d.getHours().toString(),
      "m+": d.getMinutes().toString(),
      "s+": d.getSeconds().toString(),
    };

    for (const k in opt) {
      const ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  },

  fromNow(date: Date | string | number) {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = now - past;

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    if (diff < minute) return "刚刚";
    if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)}小时前`;
    if (diff < month) return `${Math.floor(diff / day)}天前`;
    if (diff < year) return `${Math.floor(diff / month)}个月前`;
    return `${Math.floor(diff / year)}年前`;
  },
};
