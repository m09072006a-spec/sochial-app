import * as zod from "zod" ;


 export let schema = zod.object({

  name : zod.string().min(3 , "name must be at least 3 characters").max(20 , "name must be at most 20 characters") ,
  username : zod.string().optional() ,
  email : zod.email("invalid email") ,
  dateOfBirth : zod.coerce.date(),
  gender : zod.enum(["male","female" , "null"]),
  password : zod.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "password must contain at least one uppercase letter, one lowercase letter, and one digit") ,
  rePassword : zod.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "password must contain at least one uppercase letter, one lowercase letter, and one digit") ,




} ).refine(function (value) {
  return value.password === value.rePassword

} , {
  path : ["rePassword"] ,
  error : "passwords do not match"
 
} )
//   type SignupType = zod.infer<typeof schema> 