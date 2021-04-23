const utilities = {
  safelyParseJson(string) {
    try {
      return JSON.parse(string);
    } catch (e) {
      return;
    }
  },
};

export default utilities;
