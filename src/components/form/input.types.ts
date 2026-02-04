export const InputMask = {
  PHONE: "phone",
  CPF: "cpf",
  CNPJ: "cnpj",
  CEP: "cep",
  CURRENCY: "currency",
  DATE: "date",
} as const;

export type InputMaskType = (typeof InputMask)[keyof typeof InputMask];

export type MaskType = InputMaskType | (string & {});
