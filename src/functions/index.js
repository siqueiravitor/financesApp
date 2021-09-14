import react from "react";

export function moneyFormat(value){
    value = value.toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return value;
}