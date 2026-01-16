import { response } from '../utils/response.js';
import { createBillService } from '../service/stockService.js';

export const createBill = async (req, res) => {

    try {
        const result = await createBillService(req.body);
        if(result.status === 201) {
            return res.status(201).send(response('SUCCESS', result.message, result.data ));
        }
        else {
            return res.status(result.status).send(response('FAILED', result.message));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }

}