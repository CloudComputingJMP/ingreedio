import './FilledButton.scss';

import React, { ReactNode } from 'react';

import Button from '../Button/Button';

export enum ColorScheme {
  GRADIENT = 'gradient',
  REVERSE_GRADIENT = 'reverse-gradient',
  DISABLED = 'disabled',
  AI = 'ai',
}

type FilledButtonProps = {
  children?: ReactNode;
  isDisabled?: boolean;
  reverseGradient?: boolean;
  colorScheme?: ColorScheme;
  onClick?: () => void;
};

const FilledButton = ({
  children,
  reverseGradient = false,
  isDisabled = false,
  colorScheme,
  onClick = () => {},
}: FilledButtonProps): JSX.Element => {
  let buttonClass = 'button gradient';

  if (colorScheme) {
    buttonClass = `button ${colorScheme}`;
  } else {
    let computedColorScheme: ColorScheme;
    if (isDisabled) {
      computedColorScheme = ColorScheme.DISABLED;
    } else if (reverseGradient) {
      computedColorScheme = ColorScheme.REVERSE_GRADIENT;
      buttonClass = `button ${computedColorScheme}`;
    }
  }

  return (
    <Button
      onClick={!isDisabled ? onClick : () => {}}
      // eslint-disable-next-line no-nested-ternary
      className={buttonClass}
      type="submit"
    >
      {children}
    </Button>
  );
};

export default FilledButton;
