import * as zod from "zod" ;


 export let loginSchema = zod.object({


  email : zod.email("invalid email") ,

 
  password : zod.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "password must contain at least one uppercase letter, one lowercase letter, and one digit") ,
 

 })
//   type SignupType = zod.infer<typeof schema> 