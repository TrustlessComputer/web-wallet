export const colors = {
  white: '#FFFFFF',
  black: '#000000',
};

export type ColorsTheme = typeof darkTheme;

const commonTheme = {
  white: colors.white,
  black: colors.black,

  // colors system

  blue: {
    primary: '#E3F5FF',
    a: '#A8C5DA',
    b: '#B1E3FF',
  },

  purple: {
    primary: '#E5ECF6',
    50: '#F2F5FA',
    a: '#95A4FC',
    b: '#C6C7F8',
  },

  primary: {
    '333': '#333333',
    brand: '#1C1C1C',
    secondary: '#1C1C1C',
    '2e': '#2e2e2e',
    '5b': '#5b5b5b',
    d9: '#d9d9d9',
    light: '#F7F9FB',
    f2: '#f2f2f2',
  },

  yellow: {
    A: '#FFE899',
    B: '#F9D03F',
    C: '#FFAA59',
  },

  green: {
    a: '#A1E3CB',
    b: '#BAEDBD',
    c: '#24c087',
  },

  red: {
    A: '#FF4747',
    B: '#FF8B8B',
    C: '#FF6666',
  },

  dark: {
    '120': '#010101',
    '110': '#0F0F0F',
    '100': '#1C1C1C',
    '80': '#2E2E2E',
    '60': '#5B5B5B',
    '40': '#898989',
    '20': '#B6B6B6',
    '10': '#CECECE',
    '5': '#ECECED',
  },

  light: {
    '100': '#FFFFFF',
    '80': '#FAFAFA',
    '60': '#F4F4F4',
    '40': '#EFEFEF',
    '20': '#E9E9E9',
    '10': '#E7E7E7',
    '5': '#E5E5E5',
  },
};

export const darkTheme = {
  ...commonTheme,
  // Background
  bg1: commonTheme.primary.brand,
  bg2: commonTheme.primary[333],
  bg3: '#404040',
  bg4: '#cecece',
  bg5: '#f2f2f2',
  bg6: commonTheme.yellow.A,

  // Text
  text1: '#F5F5F5',
  text2: '#898989',
  text3: '#e5e5e5',
  text4: commonTheme.purple.b,
  text5: '#4f43e2',
  text6: commonTheme.red.A,
  text7: commonTheme.primary.brand,
  text8: commonTheme.primary.secondary,

  // Border
  border1: '#2c2c2c',
  border2: '#5b5b5b',
  border3: '#cecece',

  // Button
  btn1: '#1A73E8',
  btn2: '#404040',
  btn3: commonTheme.yellow.A,

  // Icons
  icon1: '#D9D9D9',
  icon2: '#D9D9D9',

  // Hover1
  hover1: '#3b3a3a',

  // text
  'text-primary': commonTheme.light['100'],
  'text-secondary': commonTheme.dark['10'],
  'text-highlight': commonTheme.yellow['A'],
  'text-parallel': commonTheme.dark['100'],
  'text-third': commonTheme.dark['5'],
  'text-four': commonTheme.dark['40'],
  'text-five': commonTheme.dark['20'],
  'text-tab-item': commonTheme.yellow['A'],
  'text-error': commonTheme.red.A,

  // button
  'button-primary': commonTheme.yellow['A'],
  'button-negative': commonTheme.red.A,

  // border
  'border-primary': commonTheme.dark['60'],
  'border-secondary': commonTheme.yellow['A'],
  'border-third': commonTheme.primary.d9,
  'border-four': commonTheme.dark['5'],

  bg: {
    primary: commonTheme.dark['110'],
    secondary: commonTheme.dark['80'],
    third: commonTheme.dark['100'],
    four: commonTheme.primary['f2'],
    modal: commonTheme.dark['100'],
    'tab-item': commonTheme.dark['80'],
    'nft-item': 'transparent',
  },

  card: {
    primary: commonTheme.dark['120'],
    secondary: commonTheme.dark['110'],
    bns: '#17171a',
  },
};

export const lightTheme = {
  ...commonTheme,

  // Background
  bg1: '#EFEFEF',
  bg2: commonTheme.white,
  bg3: '#F8F8F8',
  bg4: '#cecece',
  bg5: '#f2f2f2',
  bg6: commonTheme.primary.brand,

  // Text
  text1: commonTheme.black,
  text2: '#BFBFBF',
  text3: '#9C9C9C',
  text4: commonTheme.purple.b,
  text5: '#4f43e2',
  text6: '#ff4747',
  text7: commonTheme.primary.brand,
  text8: commonTheme.primary.secondary,

  // Border
  border1: '#e3e2e2',
  border2: '#F2F4F5',
  border3: '#1A73E8',

  // Button
  btn1: '#282828',
  btn2: commonTheme.white,
  btn3: commonTheme.yellow.A,

  // Icons
  icon1: commonTheme.black,
  icon2: '#BFBFBF',

  // Hover1
  hover1: '#D9D9D9',

  // text
  'text-primary': commonTheme.dark['100'],
  'text-secondary': commonTheme.dark['60'],
  'text-highlight': commonTheme.yellow['A'],
  'text-parallel': commonTheme.white,
  'text-third': commonTheme.dark['5'],
  'text-four': commonTheme.dark['40'],
  'text-five': commonTheme.dark['60'],
  'text-tab-item': commonTheme.white,
  'text-error': commonTheme.red.A,

  // button
  'button-primary': commonTheme.yellow['C'],
  'button-negative': commonTheme.red.A,

  // border
  'border-primary': commonTheme.dark['10'],
  'border-secondary': commonTheme.yellow['C'],
  'border-third': commonTheme.primary.d9,
  'border-four': commonTheme.dark['5'],

  bg: {
    primary: commonTheme.white,
    secondary: commonTheme.light['80'],
    third: commonTheme.light['100'],
    four: commonTheme.primary['f2'],
    modal: commonTheme.white,
    'tab-item': commonTheme.yellow['C'],
    'nft-item': commonTheme.light['80'],
  },

  card: {
    primary: commonTheme.dark['120'],
    secondary: commonTheme.light['80'],
    bns: 'transparent',
  },
};
