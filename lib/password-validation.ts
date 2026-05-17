export type PasswordRequirement = {
  id: string;
  label: string;
  met: boolean;
};

export const getPasswordRequirements = (
  password: string
): PasswordRequirement[] => [
  {
    id: 'length',
    label: 'At least 8 characters',
    met: password.length >= 8,
  },
  {
    id: 'capital',
    label: 'At least one capital letter',
    met: /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'At least one number',
    met: /\d/.test(password),
  },
];

export const getPasswordValidationError = (password: string) => {
  if (!password) {
    return 'Enter a password.';
  }

  const unmetRequirement = getPasswordRequirements(password).find(
    (requirement) => !requirement.met
  );

  return unmetRequirement
    ? `Password must include: ${unmetRequirement.label.toLowerCase()}.`
    : null;
};

export const getConfirmedPasswordError = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  const passwordError = getPasswordValidationError(password);

  if (passwordError) {
    return passwordError;
  }

  if (!confirmPassword) {
    return 'Confirm your password.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
};
