import Contract from "../Hooks/ExchangeContract";
import { useState } from "react";
const OrdersInBook = async () => {
  const [orderCounter, setOrderCounter] = useState(0);

  const ExchangeContract = Contract();
  ExchangeContract.then((res) => {
    res.orderCounter().then((res) => {
      setOrderCounter(res.toNumber());
    });
  });
  const orderlist = [];

  for (let i = 1; i <= orderCounter; i++) {
    ExchangeContract.then((res) => {
      res.id_to_cancelOrder(i).then((res) => {
        console.log(res);
        if (res !== true) {
          ExchangeContract.then((res) => {
            res.id_to_order(i).then((res) => {
              const orderSchema = [
                res[0].toNumber(),
                res[1],
                res[2],
                res[3].toBigInt(),
                res[5].toBigInt(),
                res[6].toNumber(),
              ];
              orderlist.push(orderSchema);
            });
          });
        }
      });
    });
  }

  return orderlist;
};

export default OrdersInBook;
