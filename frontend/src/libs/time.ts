export const formatDetailed = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const getHourWord = (h: number) => {
      if (h % 100 >= 11 && h % 100 <= 19) return "часов";
      switch (h % 10) {
        case 1:
          return "час";
        case 2:
        case 3:
        case 4:
          return "часа";
        default:
          return "часов";
      }
    };

    const hourWord = getHourWord(hours);

    if (mins === 0) {
      return `${hours} ${hourWord}`;
    }

    return `${hours} ${hourWord === "час" ? "час" : "ч"} ${mins} мин`;
  }

  return "24 часа";
};
