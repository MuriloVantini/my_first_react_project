import { useNavigate } from "react-router-dom";

interface Params {
  name:string,
  linkto:string
}
const ActionButton = ({params}:{params:Params}) => {
  const navigate = useNavigate();
  return (
    <a onClick={()=> navigate(params.linkto)} className="hover:bg-white py-1 px-2 rounded-sm hover:cursor-pointer"> {params.name}</a>
  )
}

export default ActionButton
