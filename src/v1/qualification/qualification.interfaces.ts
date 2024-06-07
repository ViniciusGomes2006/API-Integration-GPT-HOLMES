export interface userIdentification {
  name: string
  nationality: string
  identification: string
  cpf: string | ""
  job: string
  marital_status: string,
  email: string | ""
}
export interface userInfoProperties {
  address: string | ""
  city: string | ""
  neighborhood : string | ""
  state: string | ""
  zip_code: string | ""
}

export interface userProperty {
  user_info: userIdentification
  user_location: userInfoProperties
}