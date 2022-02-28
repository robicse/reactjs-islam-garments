import React, { useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "../../../const/api";
const WholeProduct = ({
  push,
  token,
  editData,
}) => {


  useEffect(() => {
    Axios.post(
      `${baseUrl}/chart_of_account_transaction_details`,
      {
        chart_of_account_transaction_id: editData.id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => {
        res.data.response.chart_of_account_transaction_details.map((prd) =>

          push({
            chart_of_account_name: prd.chart_of_account_name,
            debit_or_credit:
              prd.debit == null ? "credit" : "debit",
            amount: prd.debit == null ? prd.credit : prd.debit,
            description: prd.description,
            chart_of_account_transaction_detail_id: prd.id,
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return <div></div>;
};
export default WholeProduct;
