

import {Box,Input, Button} from '@material-ui/core';
import React, { useState } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { baseUrl } from "../../../const/api";
import axios from "axios";


const UploadAvatarCom = ({token,supplierId, handleCloseUpload, mutate}) => {



  const [img, setImg] = useState(null);
  const [loadingButton, setLoadingButton] = useState(true);

  const handleSubmit = async() => {
    setLoadingButton(true)
    console.log('img',img)
    const formData = new FormData();
    formData.append('nid_image', img);
    formData.append('supplier_id', supplierId);
  
  const config = { headers: 
    { 'Content-type': 'multipart/form-data', Authorization: 'Bearer ' + token }
  };
    try {
const res = await axios.post(
  `${baseUrl}/supplier_image`,
  formData,
  config,
);
console.log(res)

handleCloseUpload()
mutate();
      
    } catch (error) {
      setLoadingButton(false)
      console.log(error)
      
    }

  }
 
  return (
    <div>
      <input type="file" 
      onChange={(e)=>{
        setImg(e.target.files[0])
        setLoadingButton(false)
      }}/>
      <Button
        variant="contained"
        color="default"
        disabled={loadingButton}
        startIcon={<CloudUploadIcon />}
        onClick={handleSubmit}
      >
        Upload
      </Button>

    </div>
  );
};

export default UploadAvatarCom;
