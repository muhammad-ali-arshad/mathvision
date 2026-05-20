import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { toMathLines } from '@/lib/math-format';

interface MathExpressionProps {
  value: string;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function MathExpression({
  value,
  color = colors.text,
  size = 22,
  style,
}: MathExpressionProps) {
  const lines = toMathLines(value);

  return (
    <View
      style={[
        {
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Math.max(4, Math.round(size / 4)),
        },
        style,
      ]}
    >
      {lines.map((line, index) => (
        <Text
          key={`${line}-${index}`}
          selectable
          style={{
            color,
            fontSize: size,
            lineHeight: Math.round(size * 1.45),
            fontWeight: '600',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}
