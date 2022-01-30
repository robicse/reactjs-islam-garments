export const dateFormatWithTime = (d) => {
  
    if(d){
     const dateArray = d.split(" ") 
    const da = dateArray[0].split('-');
    const time = dateArray[1];
    return  `${da[2]}-${da[1]}-${da[0]} ${time}`
    }else{
      return null
    }


  }; 
 
  export const dateFormatWithoutTime= (d) =>{

    if(d){
      const dateArray = d.split(" ") 
    const da = dateArray[0].split('-');
    return  `${da[2]}-${da[1]}-${da[0]}`
    }else{
      return null
    }

  
  }

  export const dateFormatOnlyDate= (d) =>{
    console.log(d)
    if(d){
      const da = d.split('-');
      return  `${da[2]}-${da[1]}-${da[0]}`
    }else{
      return null
    }
 
  }


  // import { dateFormatOnlyDate } from 'helper/dateFormat'
  // render: (rowData) => dateFormatWithTime(rowData.sale_date_time)},