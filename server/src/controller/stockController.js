import { response } from '../utils/response.js';
import { createBillService, addStockService, getLogsService, getRecordsService } from '../service/stockService.js';

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

export const addStock = async (req, res) => {
    try {
        const result = await addStockService(req.body);
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

export const getLogs = async (req, res) => {
    try {
        const result = await getLogsService(req.query);
        if(result.status === 200) {
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

export const getRecords = async (req, res) => {
    try {
        const result = await getRecordsService(req.query);
        if(result.status === 200) {
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