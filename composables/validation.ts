import { ErrorObject } from "@vuelidate/core"

export const validationMessageFromError = (error: ErrorObject): string => {
  if (error.$validator === "email") {
    return "L'adresse email n'est pas valide"
  }
  if (error.$validator === "minLength") {
    // @ts-ignore
    return `Le champ doit avoir au moins ${error.$params.min} caractères`
  }
  if (error.$validator === "required") {
    // @ts-ignore
    return "Le champ ne peut pas être vide"
  }
  if (error.$validator === "sameAsPassword") {
    // @ts-ignore
    return "Les mots de passe ne correspondent pas"
  }
  return "Champ non valide"
}

export const validationMessageFromErrors = (errors: ErrorObject[]): string => {
  return errors.map((error) => validationMessageFromError(error)).join(", ")
}
