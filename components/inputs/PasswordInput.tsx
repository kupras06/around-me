import type React from 'react';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputText } from '@/craftrn-ui/components/InputText';

type PasswordInputProps = {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

export function PasswordInput({ password, setPassword }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputText
      label="Password"
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
      value={password}
      itemLeft={<IconSymbol name="lock" size={24} />}
      itemRight={
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <IconSymbol name={showPassword ? 'eye' : 'eye.slash'} size={24} />
        </Pressable>
      }
    />
  );
}
