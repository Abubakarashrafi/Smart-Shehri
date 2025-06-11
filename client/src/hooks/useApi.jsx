import { useState, useEffect } from 'react';


export const useApi = (apiCall, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiCall();
                setData(result);
            } catch (err) {
                setError(err.message || 'An error occurred');
                console.error('API call failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
};


export const usePaginatedApi = (apiCall, initialParams = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiCall(params);
                setData(result);
            } catch (err) {
                setError(err.message || 'An error occurred');
                console.error('Paginated API call failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [JSON.stringify(params)]);

    const updateParams = (newParams) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall(params);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, params, updateParams, refetch };
};


export const useApiSubmit = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submit = async (apiCall, data) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const result = await apiCall(data);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return { submit, loading, error, success, reset };
};