
export interface IRequest {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: 'WATER' | 'GAS';
}


export interface IResponse {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
}
