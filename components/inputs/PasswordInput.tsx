import type React from 'react';
import { useState } from 'react';
import { Pressable, type TextInputProps } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputText } from '@/craftrn-ui/components/InputText';

type PasswordInputProps = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'secureTextEntry'
> & {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  error?: string;
};

export function PasswordInput({
  password,
  setPassword,
  label = 'Password',
  error,
  ...inputProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputText
      label={label}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
      value={password}
      error={error}
      itemLeft={<IconSymbol name="lock" size={24} />}
      itemRight={
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <IconSymbol name={showPassword ? 'eye' : 'eye.slash'} size={24} />
        </Pressable>
      }
      {...inputProps}
    />
  );
}
