import {useCallback, useContext, useState} from 'react';
import {OpenAPIContext} from './OpenAPIProvider';
import {AxiosError, AxiosResponse, OpenAPIClientAxios, UnknownOperationMethod} from 'openapi-client-axios';

export function useOperationMethod(
    operationId: string,
): [
    UnknownOperationMethod,
    { loading: boolean; error?: Error; data?: any; response: AxiosResponse; api: OpenAPIClientAxios },
] {
    const {api} = useContext(OpenAPIContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [data, setData] = useState<any>(undefined);
    const [response, setResponse] = useState<AxiosResponse | undefined>(
        undefined
    );

    const operationMethod: UnknownOperationMethod = useCallback(
        async (...params) => {
            setLoading(true);
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
            // @ts-ignore
            return res;
        },
        [setLoading, setData, setError]
    );

    return [operationMethod, {loading, error, data, response, api}];
}
