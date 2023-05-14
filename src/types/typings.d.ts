import { Icon } from "@/components/Icons";

interface SidebarOpt {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

interface UserCred {
  email: string
  name: string
  password: string
  passwordAgain:string
}

interface UserLoginCred {
  email:string
  password:string
}