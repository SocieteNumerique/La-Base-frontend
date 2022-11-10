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
  if (error.$validator === "url") {
    // @ts-ignore
    return "Le champ ne correspond pas à un lien"
  }
  if (error.$validator === "isNationalCartographyWebsite") {
    // @ts-ignore
    return "Le champ doit commencer par https://[www.]cartographie.societenumerique.gouv.fr"
  }
  if (error.$validator === "isLinkedinUrl") {
    // @ts-ignore
    return "Le champ doit commencer par https://www.linkedin.com ou https://linkedin.com"
  }
  if (error.$validator === "isFacebookUrl") {
    // @ts-ignore
    return "Le champ doit commencer par https://www.facebook.com ou https://facebook.com"
  }
  if (error.$validator === "isTwitterUrl") {
    // @ts-ignore
    return "Le champ doit commencer par https://www.twitter.com ou https://twitter.com"
  }
  return "Champ non valide"
}

export const validationMessageFromErrors = (errors: ErrorObject[]): string => {
  return errors.map((error) => validationMessageFromError(error)).join(", ")
}
