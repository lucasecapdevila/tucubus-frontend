interface ColorPalette {
  PRIMARY: string;
  WHITE: string;
}

interface ButtonStyle {
  backgroundColor: string;
  color: string;
}

interface ButtonStyles {
  PRIMARY: ButtonStyle;
}

// Constantes de estilos compartidos
export const COLORS: ColorPalette = {
  PRIMARY: '#0c5392',
  WHITE: '#fff',
};

export const BUTTON_STYLES: ButtonStyles = {
  PRIMARY: {
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.WHITE,
  },
};

export const PAGE_SIZE_DEFAULT: number = 10;
