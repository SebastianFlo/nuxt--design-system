// Temporary (TM) hack. TODO: Abstract these pages;
export const isChooseBoxPage = (path: string) => {
  return /choose-your-box|vaelg-din-ugekasse|valj-matkasse/.test(path);
};
