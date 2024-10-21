import CircularProgress from "@mui/joy/CircularProgress";
import axios from "axios";
import React, { useEffect } from "react";

const CircularLoading = ({url}:{url:string}) => {
  const [progress, setProgress] = React.useState(0);

  function carregarComProgresso() {
    const token = localStorage.getItem("token");
    return axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` },
      onDownloadProgress: function (progressEvent:any) {
        const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Atualize a barra de progresso para essa requisição
        setProgress(percentComplete);
      }
    });
  }
  useEffect(()=>{
    carregarComProgresso();
  });
  

  return (
    <div className="pt-16 flex justify-center items-center w-full h-screen">
      <CircularProgress determinate value={progress} />
    </div>
  );
};

export default CircularLoading;
