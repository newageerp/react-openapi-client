import {useContext, useEffect, useState} from 'react';
import {OpenAPIContext} from './OpenAPIProvider';
import {AxiosError, AxiosResponse, OpenAPIClientAxios, UnknownOperationMethod} from 'openapi-client-axios';

type OperationParameters = Parameters<UnknownOperationMethod>;

export function useOperation(
    operationId: string,
    ...params: OperationParameters
): { loading: boolean; error?: Error; data?: any; response: AxiosResponse; api: OpenAPIClientAxios } {
    const {api} = useContext(OpenAPIContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [data, setData] = useState<any>(undefined);
    const [response, setResponse] = useState<AxiosResponse | undefined>(
        undefined
    );

    useEffect(() => {
        (async () => {
            const client = await api.getClient();
            let res: AxiosResponse;
            try {
                res = await client[operationId](...params);
                setResponse(res);
                setData(res.data);
                setError(undefined);
            } catch (err) {
                setError(err);
                setData({data: []});
            }
            setLoading(false);
        })();
    }, []);

    return {loading, error, data, response, api};
}
