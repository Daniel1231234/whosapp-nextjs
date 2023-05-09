"use client";

import { useRef } from "react";
import ContentEditable from "react-contenteditable";
import Button from "../UI/Button";
import axios from "axios";

interface EditableProps {
    currName:string | null | undefined
    currEmail:string | null | undefined
}

const Editable = ({currName,currEmail}:EditableProps) => {
  const name = useRef<any>(null);
  const email = useRef<any>(null);

  const handleChange = (evt: any) => {
    const propertyType = evt.currentTarget.id
    propertyType === "name" ? name.current = evt.target.value : email.current = evt.target.value
  };


  const handleSubmit = async () => {
    console.log(name.current)
    console.log(email.current)

    const res = await axios.post('/api/user/edit', {name:name.current, email:email.current})
    console.log(res)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="text-gray-700 font-medium" htmlFor="name">
          Name
        </label>
        <ContentEditable
          id="name"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          html={name.current ? name.current : currName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="text-gray-700 font-medium" htmlFor="email">
          Email
        </label>
        <ContentEditable
          id="email"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          html={email.current ? email.current : currEmail}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" onClick={handleSubmit}>OK</Button>
    </div>
  );
};

export default Editable;
