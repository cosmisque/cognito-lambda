import React from 'react';
import { Text } from '@mantine/core';

export function ClickableText({ label, onClick, color, underline }) {
  return (
    <Text
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      c={color || 'black'}
      td={underline && 'underline'}>
      {label}
    </Text>
  );
}
