const ActionButton = ({name}: {name:string}) => {
  return (
    <a className="hover:bg-white py-1 px-2 rounded-sm hover:cursor-pointer"> {name}</a>
  )
}

export default ActionButton
