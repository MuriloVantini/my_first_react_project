import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const data = {
  id: 1,
  title: "Título do Post",
  description: "Descrição do Post",
  image:
    "https://images.unsplash.com/photo-1728996152930-233c5aca21d7?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};
const data2 = {
  id: 1,
  title: "Título do Post",
  description: "Descrição do Post",
  image:
    "https://images.unsplash.com/photo-1721332155484-5aa73a54c6d2?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const datas = [data, data2, data, data2, data, data2, data, data2, data2, data, data];

const HomePage = () => {
  return (
    <div className="py-40">
      <div className="flex flex-wrap justify-center gap-4">
        {datas.map((item) => (
          <div
            key={item.id}
            className="max-w-sm rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4"
          >
            <a href="#">
              <img className="rounded-t-lg" src={item.image} alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.title}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {item.description}
              </p>
              <Button variant="outline">
                <Eye /> Ver post
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
