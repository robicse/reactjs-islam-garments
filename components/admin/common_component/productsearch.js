
import React from 'react';
import cogoToast from 'cogo-toast';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
 
export default function ProductName({
    searchUrl,
    searchBody,
    headerds,
    handleProductAdd,
    warehouseIdRequired
}) {
console.log(searchUrl,
  searchBody,
  headerds,
  handleProductAdd)
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [currentValue, setCurrentValue] = React.useState(false);
  const handleValue = (val) => {
    if (val.length > 2) {
      setCurrentValue(val);
    }
  };


  React.useEffect(() => {
  
    (async () => {
        if(warehouseIdRequired && !searchBody.warehouse_id ) {
          return cogoToast.warn('Please select warehouse',{position: 'top-right', bar:{size: '10px'}});
        }

        try {
            const result  = await  axios.post(searchUrl,{...searchBody,name: currentValue }, headerds);
          
          
            if(!result?.data?.data?.data.length){
                cogoToast.error('Product Not Found',{position: 'top-right', bar:{size: '10px'}});
            }else{
                setOptions(result.data.data.data) 
            }    
        } catch (error) {
          // cogoToast.error('Product Not Found',{position: 'top-right', bar:{size: '10px'}});
            console.log(error)
        }
     
    })();


  }, [currentValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);



  function addprod(__FOUND) {
    setCurrentValue('');
    if (!__FOUND) {
      return;
    }
    handleProductAdd(__FOUND)
    console.log(__FOUND)

    setOpen(false);
  }



  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        addprod(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        handleValue(newInputValue);
      }}
     
      getOptionLabel={(option) =>
        option.product_name +
        '  -> TK' +
        option.purchase_price 
        // ' -> QTY ' +
        // option.current_stock
      }
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by product name"
          variant="outlined"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
